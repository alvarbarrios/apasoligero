"""Regression tests for contact + guestbook API. Run: cd /app/backend && pytest tests -q"""
import os
import uuid
import pytest
import httpx

BASE = os.environ.get("TEST_API_URL", "http://localhost:8001").rstrip("/")


@pytest.fixture(scope="module")
def client():
    with httpx.Client(base_url=BASE, timeout=30) as c:
        yield c


def test_guestbook_create_and_list(client):
    name = f"Test {uuid.uuid4().hex[:6]}"
    r = client.post("/api/guestbook", json={"nombre": name, "lugar": "Madrid", "mensaje": "Mensaje de prueba válido."})
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["nombre"] == name and "email" not in body and "_id" not in body
    lst = client.get("/api/guestbook", params={"page": 1, "size": 5}).json()
    assert lst["total"] >= 1 and any(i["id"] == body["id"] for i in lst["items"])


def test_guestbook_validation(client):
    r = client.post("/api/guestbook", json={"nombre": "A", "mensaje": "corto"})
    assert r.status_code == 422
    r = client.post("/api/guestbook", json={"nombre": "Bot", "mensaje": "Mensaje spam largo", "website": "http://x"})
    assert r.status_code == 400


def test_contact_validation(client):
    r = client.post("/api/contact", json={"tema": "Otros", "asunto": "x", "nota": "ok"})
    assert r.status_code == 422
    r = client.post("/api/contact", json={"tema": "Inválido", "asunto": "Asunto", "nota": "Nota válida"})
    assert r.status_code == 422


def test_contact_honeypot_silently_ok(client):
    r = client.post("/api/contact", json={"tema": "Otros", "asunto": "Spam", "nota": "Spam spam", "website": "http://x"})
    assert r.status_code == 200 and r.json()["status"] == "ok" and "id" not in r.json()


ADMIN = {"email": os.environ.get("ADMIN_EMAIL", "autor@apasoligero.com"), "password": os.environ.get("ADMIN_PASSWORD", "PasoLigero-2026!")}


@pytest.fixture(scope="module")
def token(client):
    r = client.post("/api/auth/login", json=ADMIN)
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


def test_auth_bad_password(client):
    r = client.post("/api/auth/login", json={"email": ADMIN["email"], "password": "nope"})
    assert r.status_code == 401


def test_auth_me_and_admin_guard(client, token):
    assert client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"}).json()["role"] == "admin"
    assert client.get("/api/admin/guestbook").status_code == 401
    assert client.get("/api/admin/guestbook", headers={"Authorization": "Bearer bad"}).status_code == 401


def test_moderation_hide_share_delete(client, token):
    h = {"Authorization": f"Bearer {token}"}
    created = client.post("/api/guestbook", json={"nombre": "Moderado", "mensaje": "Entrada para moderar."})
    if created.status_code == 429:
        pytest.skip("guestbook rate limit reached")
    eid = created.json()["id"]
    assert client.get(f"/api/guestbook/{eid}").status_code == 200
    assert client.patch(f"/api/admin/guestbook/{eid}", json={"hidden": True}, headers=h).json()["hidden"] is True
    assert client.get(f"/api/guestbook/{eid}").status_code == 404
    assert all(i["id"] != eid for i in client.get("/api/guestbook", params={"size": 50}).json()["items"])
    lst = client.get("/api/admin/guestbook", params={"filter": "hidden"}, headers=h).json()
    assert any(i["id"] == eid for i in lst["items"])
    assert client.delete(f"/api/admin/guestbook/{eid}", headers=h).json()["deleted"] is True
    assert client.delete(f"/api/admin/guestbook/{eid}", headers=h).status_code == 404
