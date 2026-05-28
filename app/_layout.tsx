import {initDatabase} from '@/database/db';
import {MaterialIcons} from '@expo/vector-icons';
import {Tabs} from 'expo-router';
import {useEffect} from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  useEffect(() => {
    try {
      initDatabase();
      console.log("Banco inicializado!");
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);   
    }
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerTintColor: '#d09ef3',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Galeria',
          tabBarIcon: ({ color }) => <MaterialIcons name="photo-library" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => <MaterialIcons name="map" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
