import { listPhotos, Photo } from '@/repositories/photoRepository';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

export default function MapScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    try {
      setLoading(true);
      const data = listPhotos().filter((p) => p.latitude && p.longitude);
      setPhotos(data);
    } catch (err) {
      console.error("Erro ao carregar fotos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Nenhuma foto com localização</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: photos[0].latitude!,
    longitude: photos[0].longitude!,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {photos.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude!, longitude: p.longitude! }}
          >
            <Callout>
              <View style={styles.callout}>
                <Image source={{ uri: p.image_uri }} style={styles.calloutImage} />
                <View style={styles.calloutText}>
                  <Text style={styles.calloutTitle}>{p.title}</Text>
                  <Text style={styles.calloutDate}>
                    {new Date(p.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 18, fontWeight: '600' },
  callout: { flexDirection: 'row', width: 220 },
  calloutImage: { width: 80, height: 80, borderRadius: 8 },
  calloutText: { paddingLeft: 10, justifyContent: 'center', flexShrink: 1 },
  calloutTitle: { fontWeight: '600' },
  calloutDate: { color: '#666', marginTop: 4 },
});
