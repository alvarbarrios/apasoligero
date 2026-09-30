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
