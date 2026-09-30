# Auth testing — A Paso Ligero (single owner)

Credentials: see /app/memory/test_credentials.md

1. MongoDB: `db.users.findOne({role:"admin"},{password_hash:1})` → hash starts with `$2b$`; indexes: users.email unique, login_attempts.identifier.
2. API:
   - `curl -X POST $API/api/auth/login -H 'Content-Type: application/json' -d '{"email":"autor@apasoligero.com","password":"PasoLigero-2026!"}'` → 200 `{access_token,...}`
   - `curl $API/api/auth/me -H "Authorization: Bearer <token>"` → admin user
   - wrong password → 401; 5 wrong in a row → 429 for 15 min
   - `/api/admin/guestbook` without token → 401
3. Frontend: /admin shows login form (admin-login-form); after login shows moderation table; token in localStorage `apl_token`; logout clears.
