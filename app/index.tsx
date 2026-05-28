import React, {useCallback, useState} from 'react';
import {Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Button} from 'react-native';
import {deletePhoto, insertPhoto, listPhotos} from '@/repositories/photoRepository';
import {MaterialIcons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function GaleriaScreen() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [pendingPhoto, setPendingPhoto] = useState<{uri:string, coords:any}|null>(null);

  const load = useCallback(() => {
    try {
      const data = listPhotos();
      setPhotos(data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar fotos');
      console.error(err);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleAdd = async () => {
  const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (mediaStatus !== 'granted') {
    Alert.alert("Permissão negada", "O app precisa de acesso à galeria para escolher fotos.");
    return;
  }

  const pick = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images' });
  if (pick.canceled) return;
  const uri = pick.assets[0].uri;

  const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
  let coords = null;
  if (locationStatus === 'granted') {
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
  } else {
    Alert.alert("Permissão negada", "O mapa não estara disponível sem acesso a localização.");
  }
    setPendingPhoto({ uri, coords });
    setShowModal(true);
  };

  const savePhoto = () => {
    if (!pendingPhoto) return;
    try {
      insertPhoto({
        title: titleInput || "Sem título",
        imageUri: pendingPhoto.uri,
        latitude: pendingPhoto.coords?.lat ?? null,
        longitude: pendingPhoto.coords?.lon ?? null,
      });
      load();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível salvar a foto");
      console.error(err);
    } finally {
      setShowModal(false);
      setTitleInput("");
      setPendingPhoto(null);
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
            <Text style={styles.delText}>Excluir</Text>
            </TouchableOpacity>

          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

      
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Digite um título</Text>
            <TextInput
              value={titleInput}
              onChangeText={setTitleInput}
              placeholder="Título da foto"
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setShowModal(false)} />
              <Button title="Salvar" onPress={savePhoto} />
            </View>
          </View>
        </View>
      </Modal>
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
  delText: { color: '#FF3B30', fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e08ef3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' },
  modalBox: { backgroundColor:'#fff', padding:20, borderRadius:8, width:'80%' },
  modalTitle: { fontSize:16, fontWeight:'600', marginBottom:10 },
  input: { borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:8, marginBottom:12 },
  modalButtons: { flexDirection:'row', justifyContent:'space-between' }
});
