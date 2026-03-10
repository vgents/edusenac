/**
 * Registrar Presença - Mapa, ponto GPS, raio, confirmar, loading, feedback
 * Simulação: alterna entre usuário dentro/fora do raio a cada abertura do mapa
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../../context/ThemeContext';
import { useFeedback } from '../../context/FeedbackContext';
import { Button, SafeScreen, Icon } from '../../components/ui';
import { getClassById, addAttendance } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../utils/storage';
import { spacing } from '../../styles/spacing';

const hexToRgba = (hex, alpha) => {
  const h = String(hex).replace('#', '');
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return hex;
};

const { width } = Dimensions.get('window');
const SIMULATE_KEY = '@edusenac_simulate_faculdade_fora';
const RADIUS = 500;

/** Gera ponto a `distanceMeters` metros do usuário (bearing em graus, 0=norte) */
function pointAtDistance(userLat, userLng, distanceMeters, bearingDeg = 0) {
  const R = 6371e3;
  const br = (bearingDeg * Math.PI) / 180;
  const lat1 = (userLat * Math.PI) / 180;
  const lng1 = (userLng * Math.PI) / 180;
  const d = distanceMeters / R;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(br)
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(br) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
    );
  return {
    latitude: (lat2 * 180) / Math.PI,
    longitude: (lng2 * 180) / Math.PI,
  };
}

export const RegistrarPresencaScreen = ({ route, navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const { success, error, showLoading, hideLoading } = useFeedback();
  const { classId } = route.params || {};
  const [classData, setClassData] = useState(null);
  const [location, setLocation] = useState(null);
  const [facultyLocation, setFacultyLocation] = useState(null);
  const [simulateOutside, setSimulateOutside] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Obtendo localização...');
  const mapRef = useRef(null);
  const facultyGenerated = useRef(false);

  useEffect(() => {
    loadClass();
    getCurrentLocation();
  }, [classId]);

  useEffect(() => {
    if (!location || facultyGenerated.current) return;
    facultyGenerated.current = true;
    (async () => {
      const stored = await storage.getItem(SIMULATE_KEY);
      const fora = stored === 'true';
      const proximaFora = !fora;
      await storage.setItem(SIMULATE_KEY, String(proximaFora));
      setSimulateOutside(proximaFora);

      const bearing = Math.random() * 360;
      const faculty = fora
        ? pointAtDistance(location.latitude, location.longitude, 650, bearing)
        : pointAtDistance(location.latitude, location.longitude, 150, bearing);
      setFacultyLocation({ ...faculty, radius: RADIUS });
    })();
  }, [location]);

  const loadClass = async () => {
    const c = await getClassById(classId);
    setClassData(c);
  };

  const getCurrentLocation = async (isRefresh = false) => {
    if (isRefresh) setLocationStatus('Atualizando localização...');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('Permissão de localização negada');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc.coords);
      setLocationStatus('Localização obtida');
    } catch (e) {
      setLocationStatus('Erro ao obter localização');
    } finally {
      setLoading(false);
    }
  };

  const effectiveFaculty = facultyLocation || classData?.location;

  const isWithinRadius = () => {
    if (!location || !effectiveFaculty) return false;
    const R = 6371e3;
    const φ1 = (effectiveFaculty.latitude * Math.PI) / 180;
    const φ2 = (location.latitude * Math.PI) / 180;
    const Δφ = ((location.latitude - effectiveFaculty.latitude) * Math.PI) / 180;
    const Δλ = ((location.longitude - effectiveFaculty.longitude) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d <= (effectiveFaculty.radius || RADIUS);
  };

  const handleConfirm = async () => {
    if (!isWithinRadius()) {
      navigation.navigate('PresencaNaoValidada', {
        classId,
        userLocation: location,
        classLocation: effectiveFaculty,
      });
      return;
    }

    setSubmitting(true);
    showLoading();
    try {
      const timestamp = new Date().toISOString();
      await addAttendance({
        studentId: user.studentId,
        classId,
        date: timestamp.split('T')[0],
        status: 'present',
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
      hideLoading();
      const hora = new Date(timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      success(`Presença registrada com sucesso! (${hora})`);
      navigation.goBack();
    } catch (e) {
      hideLoading();
      error('Erro ao registrar presença');
    } finally {
      setSubmitting(false);
    }
  };

  const classCenter = effectiveFaculty || { latitude: -15.835214, longitude: -48.012034 };
  const radius = effectiveFaculty?.radius || RADIUS;
  const mapCenter = location || classCenter;
  const ready = !!location && (!!facultyLocation || !!classData?.location);

  useEffect(() => {
    if (location && mapRef.current && classCenter) {
      const delta = simulateOutside ? 0.02 : 0.005;
      mapRef.current.animateToRegion({
        latitude: (location.latitude + classCenter.latitude) / 2,
        longitude: (location.longitude + classCenter.longitude) / 2,
        latitudeDelta: delta,
        longitudeDelta: delta,
      }, 500);
    }
  }, [location, classCenter, simulateOutside]);

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.surface }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

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
            radius={radius}
            fillColor="rgba(255, 151, 1, 0.2)"
            strokeColor="rgba(255, 151, 1, 0.8)"
            strokeWidth={2}
          />
          <Marker coordinate={classCenter} title="Local da aula" />
        </MapView>

        <View style={[styles.footerCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.status, { color: theme.text }]}>{locationStatus}</Text>
          {simulateOutside !== null && (
            <Text style={[styles.simulateBadge, { color: theme.textSecondary }]}>
              {simulateOutside ? 'Simulação: fora do raio' : 'Simulação: dentro do raio'}
            </Text>
          )}
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            {isWithinRadius()
              ? 'Você está dentro do raio permitido. Confirme sua presença.'
              : 'Posicione-se dentro do raio amarelo para registrar a presença.'}
          </Text>
          {!isWithinRadius() && location && (
            <TouchableOpacity
              style={[styles.refreshButton, { borderColor: theme.border }]}
              onPress={() => getCurrentLocation(true)}
              disabled={loading}
            >
              <Icon name="refresh" size={18} color={theme.primary} />
              <Text style={[styles.refreshButtonText, { color: theme.primary }]}>
                Atualizar localização
              </Text>
            </TouchableOpacity>
          )}
          <Button
            title={
              submitting
                ? 'Registrando...'
                : isWithinRadius()
                  ? 'Confirmar presença'
                  : 'Fora da localização'
            }
            onPress={handleConfirm}
            loading={submitting}
            disabled={!ready || loading || !isWithinRadius()}
            style={
              !isWithinRadius()
                ? { backgroundColor: theme.border, opacity: 1 }
                : isDarkMode
                  ? {
                      backgroundColor: hexToRgba(theme.primary, 0.35),
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.15)',
                    }
                  : { backgroundColor: theme.primary }
            }
            textStyle={
              !isWithinRadius()
                ? { color: theme.textSecondary }
                : { color: '#FFFFFF' }
            }
          />
        </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: spacing.base,
    left: spacing.base,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  footerCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  simulateBadge: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    marginBottom: spacing.base,
    borderRadius: 8,
    borderWidth: 1,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
