/**
 * Direct-to-MinIO upload helper.
 *
 * 2-step flow (per backend `POST /v1/uploads/hand-image-url`):
 *  1. Ask API for a presigned PUT URL + future public read URL.
 *  2. PUT the raw bytes straight to MinIO.
 *
 * Falls back to a local object URL when API is unreachable (demo mode).
 */

import { apiClient } from './api';

export interface UploadResult {
  object_name: string;
  public_read_url: string;
  mock: boolean;
}

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 10 * 1024 * 1024;

export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) return 'Định dạng phải là JPG, PNG hoặc WEBP.';
  if (file.size > MAX_BYTES) return 'Kích thước vượt quá 10MB.';
  return null;
}

function extFromType(type: string): 'jpg' | 'png' | 'webp' {
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  return 'jpg';
}

export async function uploadHandImage(file: File, userId: string): Promise<UploadResult> {
  try {
    const presigned = await apiClient.getPresignedUpload({
      user_id: userId,
      file_ext: extFromType(file.type),
      content_type: file.type,
    });

    const putRes = await fetch(presigned.upload_url, {
      method: 'PUT',
      headers: { 'content-type': file.type },
      body: file,
    });
    if (!putRes.ok) throw new Error(`Upload failed: ${putRes.status}`);

    return {
      object_name: presigned.object_name,
      public_read_url:
        presigned.public_read_url ?? presigned.upload_url.split('?')[0] ?? presigned.upload_url,
      mock: false,
    };
  } catch (err) {
    // Demo/offline fallback: keep a local URL so the user can keep flowing.
    console.warn('[upload] falling back to mock (no backend?):', err);
    const objectUrl = URL.createObjectURL(file);
    return {
      object_name: `mock/${userId}/${Date.now()}-${file.name}`,
      public_read_url: objectUrl,
      mock: true,
    };
  }
}
