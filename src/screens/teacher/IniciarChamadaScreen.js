/**
 * Iniciar Chamada - Dados aula, mapa, raio (auto/manual), horário, status
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useFeedback } from '../../context/FeedbackContext';
import { Button, SafeScreen, Icon } from '../../components/ui';
import { getClassById, getSubjectById, createCall } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { spacing } from '../../styles/spacing';
import { getSubjectIcon } from '../../utils/subjectIcons';

const RADIUS_OPTIONS = [200, 300, 500, 700, 1000];

export const IniciarChamadaScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { success, error, showLoading, hideLoading } = useFeedback();
  const { classId } = route.params || {};
  const [classData, setClassData] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(500);
  const [autoRadius, setAutoRadius] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    loadClass();
    getCurrentLocation();
  }, [classId]);

  useEffect(() => {
    if (classData && autoRadius && classData.location?.radius) {
      setRadius(classData.location.radius);
    }
  }, [classData, autoRadius]);

  const loadClass = async () => {
    const c = await getClassById(classId);
    setClassData(c);
    if (c?.subjectId) {
      const subj = await getSubjectById(c.subjectId);
      setSubjectName(subj?.name || 'Disciplina');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc.coords);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciar = async () => {
    showLoading();
    try {
      const loc = location || classData?.location;
      const finalRadius = autoRadius ? (classData?.location?.radius || 500) : radius;
      const call = await createCall({
        classId,
        teacherId: user.teacherId,
        startTime: new Date().toISOString(),
        location: loc ? { ...loc, radius: finalRadius } : classData?.location,
      });
      hideLoading();
      success('Chamada iniciada!');
      navigation.replace('AcompanhamentoChamada', { callId: call.id });
    } catch (e) {
      hideLoading();
      error('Erro ao iniciar chamada');
    }
  };

  const classCenter = classData?.location || {
    latitude: -15.835214,
    longitude: -48.012034,
  };
  const displayRadius = autoRadius ? (classData?.location?.radius || 500) : radius;
  const mapCenter = location || classCenter;

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...location,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500
      );
    }
  }, [location]);

  return (
    <SafeScreen>
      <TouchableOpacity
        style={styles.backBtnWrapper}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <View style={[styles.backBtn, { backgroundColor: theme.surface }]}>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </View>
      </TouchableOpacity>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Dados da aula */}
        <Animated.View entering={FadeInDown.duration(350)}>
          <View style={[styles.info, { backgroundColor: theme.surface }]}>
            <View style={styles.infoRow}>
              <Icon name={getSubjectIcon(subjectName || '')} size={32} color={theme.primary} style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={[styles.className, { color: theme.text }]}>
                  {subjectName || 'Disciplina'}
                </Text>
                <Text style={[styles.schedule, { color: theme.textSecondary }]}>
                  {classData?.schedule} - {classData?.room}
                </Text>
                <Text style={[styles.horarioLabel, { color: theme.textSecondary }]}>
                  Horário da chamada: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Mapa */}
        <Animated.View
          entering={FadeInDown.duration(350).delay(60)}
          style={styles.mapContainer}
        >
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              ...mapCenter,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
            showsMyLocationButton
          >
            <Circle
              center={classCenter}
              radius={displayRadius}
              fillColor="rgba(255, 107, 0, 0.2)"
              strokeColor="rgba(255, 107, 0, 0.8)"
              strokeWidth={2}
            />
            <Marker coordinate={classCenter} title="Local da sala" />
          </MapView>
        </Animated.View>

        {/* Raio - auto/manual */}
        <Animated.View
          entering={FadeInDown.duration(350).delay(100)}
          style={styles.radiusSection}
        >
          <View style={[styles.radiusCard, { backgroundColor: theme.surface }]}>
            <View style={styles.radiusHeader}>
              <Icon name="radio" size={24} color={theme.primary} />
              <Text style={[styles.radiusTitle, { color: theme.text }]}>
                Raio de detecção
              </Text>
              <Switch
                value={!autoRadius}
                onValueChange={(v) => setAutoRadius(!v)}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.primaryText}
              />
            </View>
            <Text style={[styles.radiusMode, { color: theme.textSecondary }]}>
              {autoRadius ? 'Automático (definido pela unidade)' : 'Manual'}
            </Text>
            {!autoRadius && (
              <View style={styles.radiusOptions}>
                {RADIUS_OPTIONS.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.radiusBtn,
                      {
                        backgroundColor: radius === r ? theme.primary : theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setRadius(r)}
                  >
                    <Text
                      style={[
                        styles.radiusBtnText,
                        { color: radius === r ? theme.primaryText : theme.text },
                      ]}
                    >
                      {r}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Text style={[styles.radiusInfo, { color: theme.text }]}>
              Raio atual: {displayRadius}m
            </Text>
          </View>
        </Animated.View>

        {/* Botão Iniciar */}
        <Animated.View
          entering={FadeInDown.duration(350).delay(140)}
          style={styles.footer}
        >
          <Button
            title="Iniciar chamada"
            onPress={handleIniciar}
            disabled={loading}
          />
        </Animated.View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  backBtnWrapper: {
    position: 'absolute',
    top: 48,
    left: spacing.lg,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  container: { flex: 1, paddingTop: 100 },
  info: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.base,
    marginBottom: spacing.base,
    padding: spacing.lg,
    borderRadius: 12,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start' },
  infoIcon: { marginRight: spacing.base },
  infoContent: { flex: 1 },
  className: { fontSize: 18, fontWeight: '600' },
  schedule: { fontSize: 14, marginTop: spacing.xs },
  horarioLabel: { fontSize: 13, marginTop: spacing.sm },
  mapContainer: {
    height: 220,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.base,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: { width: '100%', height: '100%' },
  radiusSection: { paddingHorizontal: spacing.lg, paddingVertical: spacing.base },
  radiusCard: { padding: spacing.lg, borderRadius: 12 },
  radiusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  radiusTitle: { flex: 1, fontSize: 16, fontWeight: '600' },
  radiusMode: { fontSize: 13, marginTop: spacing.xs },
  radiusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.base,
  },
  radiusBtn: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
  },
  radiusBtnText: { fontSize: 14, fontWeight: '600' },
  radiusInfo: { fontSize: 14, marginTop: spacing.base },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, paddingBottom: spacing.xxl },
});
