"""Emergent object storage (playbook pattern) — async via httpx."""
import os
import logging
import httpx

logger = logging.getLogger(__name__)

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ["EMERGENT_LLM_KEY"]
APP_NAME = "apasoligero"
storage_key = None


async def init_storage(force: bool = False) -> str:
    global storage_key
    if storage_key and not force:
        return storage_key
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY})
    r.raise_for_status()
    storage_key = r.json()["storage_key"]
    return storage_key


async def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = await init_storage()
    async with httpx.AsyncClient(timeout=180) as c:
        r = await c.put(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key, "Content-Type": content_type}, content=data)
        if r.status_code == 404:
            key = await init_storage(force=True)
            r = await c.put(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key, "Content-Type": content_type}, content=data)
    r.raise_for_status()
    return r.json()


async def get_object(path: str) -> tuple[bytes, str]:
    key = await init_storage()
    async with httpx.AsyncClient(timeout=120) as c:
        r = await c.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key})
        if r.status_code == 404:
            key = await init_storage(force=True)
            r = await c.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key})
    r.raise_for_status()
    return r.content, r.headers.get("Content-Type", "application/octet-stream")
