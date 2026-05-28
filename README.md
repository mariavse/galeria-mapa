# Galeria de Imagens com Mapa (Expo)

Aplicativo para selecionar fotos, salvar localmente em SQLite e visualizar pontos no mapa.

Como usar:

```bash
npm install
npm start
```

- Abra com Expo Go (Android) para ver mapa e câmera.

Arquivos importantes:
- `app/index.tsx` — Galeria e captura de fotos
- `app/map.tsx` — Mapa com marcadores (mobile)
- `database/db.ts` — Inicialização do SQLite
- `repositories/photoRepository.ts` — CRUD do banco

Permissões: galeria e localização (Android).

Erros e mensagens são mostrados em português.

