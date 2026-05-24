import { listPhotos } from '@/repositories/photoRepository';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function MapScreen() {
	const [photos, setPhotos] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const load = useCallback(() => {
		try {
			setLoading(true);
			const data = listPhotos().filter((p: any) => p.latitude && p.longitude);
			setPhotos(data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			load();
		}, [load])
	);

	if (loading) return (
		<View style={styles.center}><ActivityIndicator size="large" color="#007AFF"/></View>
	);

	return (
		<View style={styles.center}>
			<Text style={styles.title}>Mapa não disponível na web</Text>
			{photos.length > 0 ? (
				photos.map((p) => (
					<View key={p.id} style={styles.webItem}>
						<Text style={styles.webTitle}>{p.title}</Text>
						<Text>📍 {p.latitude?.toFixed(4)}, {p.longitude?.toFixed(4)}</Text>
					</View>
				))
			) : (
				<Text style={styles.subtitle}>Nenhuma foto com localização</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
	title: { fontSize: 18, fontWeight: '600' },
	subtitle: { color: '#666', marginTop: 8 },
	webItem: { marginTop: 12, backgroundColor: '#f5f5f5', padding: 10, borderRadius: 8, width: '100%' },
	webTitle: { fontWeight: '600' },
});
