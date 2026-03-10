/**
 * Presença não validada - Ícone alerta, texto, mapa, tentar novamente, ver regras
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { useTheme } from '../../context/ThemeContext';
import { Button, SafeScreen } from '../../components/ui';
import { Icon } from '../../components/ui';
import { getClassById } from '../../services/api';
import { spacing } from '../../styles/spacing';

const { width, height } = Dimensions.get('window');
const MAP_HEIGHT = height * 0.35;
const RADIUS = 500;

export const PresencaNaoValidadaScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { classId, userLocation, classLocation } = route.params || {};
  const [classData, setClassData] = useState(null);
  const [location, setLocation] = useState(userLocation);
  const [aulaLocation, setAulaLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const c = await getClassById(classId);
      setClassData(c);
      const loc = classLocation || c?.location;
      setAulaLocation(loc || { latitude: -15.835214, longitude: -48.012034, radius: RADIUS });
    })();
  }, [classId, classLocation]);

  const center = aulaLocation || { latitude: -15.835214, longitude: -48.012034 };
  const radius = aulaLocation?.radius || RADIUS;
  const mapCenter = location
    ? {
        latitude: (location.latitude + center.latitude) / 2,
        longitude: (location.longitude + center.longitude) / 2,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : { ...center, latitudeDelta: 0.01, longitudeDelta: 0.01 };

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.backButton, { borderColor: theme.border }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
          <Text style={[styles.backText, { color: theme.text }]}>Voltar</Text>
        </TouchableOpacity>

        {(location || aulaLocation) && (
          <View style={styles.mapWrap}>
            <MapView
              style={styles.map}
              initialRegion={mapCenter}
              showsUserLocation={!!location}
            >
              <Circle
                center={center}
                radius={radius}
                fillColor="rgba(255, 151, 1, 0.2)"
                strokeColor="rgba(255, 151, 1, 0.8)"
                strokeWidth={2}
              />
              <Marker coordinate={center} title="Local da aula" />
            </MapView>
          </View>
        )}

        <View style={styles.content}>
          <Icon
            name="alert-circle"
            size={64}
            color={theme.warning}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: theme.text }]}>
            Presença não validada
          </Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            Você precisa estar dentro do raio permitido da sala de aula para
            registrar sua presença. Verifique sua localização e tente novamente.
          </Text>

          <Button
            title="Tentar novamente"
            onPress={() => navigation.navigate('RegistrarPresenca', { classId })}
            style={styles.button}
          />
          <Button
            title="Ver regras de presença"
            variant="secondary"
            onPress={() => navigation.navigate('RegrasPresenca')}
            style={styles.button}
          />
        </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  mapWrap: {
    height: MAP_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    marginTop: spacing.sm,
    width: '100%',
  },
});
