import { deletePhoto, insertPhoto, listPhotos } from '@/repositories/photoRepository';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GaleriaScreen() {
    const [photos, setPhotos] = useState<any[]>([]);

    const load = useCallback(() => {
        try {
            const data = listPhotos();
            setPhotos(data);
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível carregar fotos');
            console.error(err);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );

    const handleAdd = async () => {
    const pick = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images' });
        if (pick.canceled) return;
        const uri = pick.assets[0].uri;

        const { status } = await Location.requestForegroundPermissionsAsync();
        let coords = null;
        if (status === 'granted') {
            const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        }

        // Solicita título (Alert.prompt disponível apenas no iOS). Usar fallback simples em outras plataformas.
        if ((Alert as any).prompt) {
            (Alert as any).prompt(
                'Título',
                'Digite um título para a foto',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Salvar',
                        onPress: (title: string | undefined) => {
                            try {
                                insertPhoto({ title: title || 'Sem título', imageUri: uri, latitude: coords?.lat ?? null, longitude: coords?.lon ?? null });
                                load();
                            } catch (err) {
                                Alert.alert('Erro', 'Não foi possível salvar a foto');
                                console.error(err);
                            }
                        },
                    },
                ],
                'plain-text'
            );
        } else {
            // Fallback: salva com título padrão
            try {
                insertPhoto({ title: 'Sem título', imageUri: uri, latitude: coords?.lat ?? null, longitude: coords?.lon ?? null });
                load();
            } catch (err) {
                Alert.alert('Erro', 'Não foi possível salvar a foto');
                console.error(err);
            }
        }
    };

    const handleDelete = (id: number) => {
        Alert.alert('Confirmar', 'Deseja excluir esta foto?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: () => {
                    try {
                        deletePhoto(id);
                        load();
                    } catch (err) {
                        Alert.alert('Erro', 'Não foi possível excluir');
                        console.error(err);
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={photos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.image_uri }} style={styles.thumb} />
                        <View style={styles.info}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.del}>
                            <MaterialIcons name="delete" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.fab} onPress={handleAdd}>
                <MaterialIcons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    card: { flexDirection: 'row', padding: 12, alignItems: 'center' },
    thumb: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
    info: { flex: 1 },
    title: { fontWeight: '600' },
    date: { color: '#666', fontSize: 12, marginTop: 6 },
    del: { padding: 8 },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
});