# Galeria de Imagens com Mapa (Expo)

Aplicativo para selecionar fotos, salvar localmente em SQLite e visualizar pontos no mapa.
Como usar:
```bash
git clone https://github.com/mariavse/galeria-mapa.git
cd galeria-mapa

npm install

expo install expo-image-picker expo-location expo-sqlite react-native-maps

npm start --tunnel
```
- Caso for usar apenas npm start certifique-se de remover o --tunnel no package.json, e verifique se o celular e o computador estão conectados na mesma rede

- Abra com Expo Go (Android) para ver mapa e câmera.
- Ative a localização antes de entrar no app

Arquivos importantes:
- `app/index.tsx` — Galeria e captura de fotos
- `app/map.tsx` , `app/map.native.tsx` — Mapa com marcadores (mobile)
- `database/db.ts` — Inicialização do SQLite
- `repositories/photoRepository.ts` — CRUD do banco

Permissões: galeria e localização (Android).

Erros e mensagens são mostrados em português.

O app não funciona no navegador
