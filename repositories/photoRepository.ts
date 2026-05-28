import { db } from "@/database/db";

export type Photo = {
  id: number;
  title: string;
  image_uri: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type NewPhotoInput = {
  title: string;
  imageUri: string;
  latitude: number | null;
  longitude: number | null;
};

export function insertPhoto(input: NewPhotoInput) {
  const stmt = db.prepareSync(`
    INSERT INTO photos (title, image_uri, latitude, longitude, created_at)
    VALUES ($title, $image_uri, $latitude, $longitude, $created_at)
  `);

  try {
    const params = {
      $title: input.title,
      $image_uri: input.imageUri,
      $latitude: input.latitude,
      $longitude: input.longitude,
      $created_at: new Date().toISOString(),
    };
    stmt.executeSync(params);
  } catch (err) {
    console.error("Erro ao inserir foto:", err);
    throw err;
  } finally {
    stmt.finalizeSync();
  }
}

export function listPhotos(): Photo[] {
  try {
    const result = db.getAllSync<Photo>(`
      SELECT id, title, image_uri, latitude, longitude, created_at
      FROM photos
      ORDER BY created_at DESC
    `);
   
    return result;
  } catch (err) {
    console.error("Erro ao listar fotos:", err);
    return [];
  }
}

export function deletePhoto(id: number) {
  try {
    db.runSync(`DELETE FROM photos WHERE id = ?`, [id]);
  } catch (err) {
    console.error("Erro ao excluir foto:", err);
    throw err;
  }
}
