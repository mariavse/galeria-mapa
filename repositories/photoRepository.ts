import { db } from "@/database/db";

type NewPhotoInput = {
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
    stmt.executeSync({
      $title: input.title,
      $image_uri: input.imageUri,
      $latitude: input.latitude,
      $longitude: input.longitude,
      $created_at: new Date().toISOString(),
    });
  } finally {
    stmt.finalizeSync();
  }
}

export function listPhotos() {
  return db.getAllSync<{
    id: number;
    title: string;
    image_uri: string;
    latitude: number | null;
    longitude: number | null;
    created_at: string;
  }>(`
    SELECT id, title, image_uri, latitude, longitude, created_at
    FROM photos
    ORDER BY created_at DESC
  `);
}
export function searchPhotosByTitle(term: string, limit = 20, offset = 0) {
  return db.getAllSync(
    `
    SELECT id, title, image_uri, latitude, longitude, created_at
    FROM photos
    WHERE title LIKE ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `,
    [`%${term}%`, limit, offset],
  );
}

export function updatePhotoTitle(id: number, title: string) {
  db.runSync(
    `
    UPDATE photos
    SET title = ?
    WHERE id = ?
  `,
    [title, id],
  );
}

export function deletePhoto(id: number) {
  db.runSync(
    `
    DELETE FROM photos
    WHERE id = ?
  `,
    [id],
  );
}