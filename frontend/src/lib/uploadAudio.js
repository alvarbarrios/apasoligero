import axios from "axios";
import { authHeaders } from "@/context/AuthContext";

const API = process.env.REACT_APP_BACKEND_URL;
const CHUNK = 1024 * 1024; // 1 MB

/** Upload an audio File in 1 MB chunks. onProgress(0..100). Returns {file_id, filename, size}. */
export async function uploadAudio(file, onProgress) {
  const uploadId = crypto.randomUUID();
  const total = Math.ceil(file.size / CHUNK);
  for (let i = 0; i < total; i++) {
    const fd = new FormData();
    fd.append("upload_id", uploadId);
    fd.append("index", String(i));
    fd.append("chunk", file.slice(i * CHUNK, (i + 1) * CHUNK), `${i}.part`);
    await axios.post(`${API}/api/admin/upload/chunk`, fd, { headers: authHeaders() });
    onProgress?.(Math.round(((i + 1) / total) * 90));
  }
  const fd = new FormData();
  fd.append("upload_id", uploadId);
  fd.append("filename", file.name);
  fd.append("total", String(total));
  const { data } = await axios.post(`${API}/api/admin/upload/complete`, fd, { headers: authHeaders() });
  onProgress?.(100);
  return data;
}
