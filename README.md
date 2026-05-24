# Galeria de Imagens com Mapa (Expo)

Aplicativo simples para capturar/selecionar fotos, salvar localmente em SQLite e visualizar pontos no mapa.

Como usar (mínimo):

```bash
npm install
npm start
```

- Abra com Expo Go (Android/iOS) para ver mapa e câmera.
- No navegador (web) o mapa nativo não funciona; você verá lista de coordenadas.

Arquivos importantes:
- `app/index.tsx` — Galeria e captura de fotos
- `app/map.tsx` — Mapa com marcadores (mobile)
- `database/db.ts` — Inicialização do SQLite
- `repositories/photoRepository.ts` — CRUD do banco

Permissões: câmera, galeria e localização (iOS/Android).

Erros e mensagens são mostrados em português.

Feito simples e direto — ideal para o trabalho prático.
