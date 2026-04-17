cd "dispatch-wares"

# Initialize Git
git init

# Create Backend structure
New-Item -ItemType Directory -Path "backend/src/services", "backend/src/middleware", "backend/prisma"
New-Item -ItemType File -Path "backend/src/server.js"

# Create Frontend structure
New-Item -ItemType Directory -Path "frontend/src/api", "frontend/src/components/Map", "frontend/src/logic"

# Create a placeholder README
"
# DispatchWares
VaultWares Cybersecurity-first Truck Dispatching Dashboard.
- React/Tailwind Frontend
- Node.js/Prisma/PostgreSQL Backend
- React Native Mobile App
" | Out-File -FilePath "README.md"

# Instructions to push to your GitHub
Write-Host "`nProject structure created! To push to your GitHub, run:" -ForegroundColor Green
Write-Host "1. git add ."
Write-Host "2. git commit -m 'Initial setup of VaultWares Dispatch'"
Write-Host "3. git remote add origin https://github.com/p-potvin/dispatch-wares.git"
Write-Host "4. git push -u origin main"

DATABASE_URL="prisma+postgres://clopeux:123Exastkill6!@localhost:5432/dispatch_wares?schema=public"
JWT_SECRET="vault-wares-secure-key-2024"
PORT=3001

http link to db: 
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xJmNvbm5lY3RfdGltZW91dD0wJm1heF9pZGxlX2Nvbm5lY3Rpb25fbGlmZXRpbWU9MCZwb29sX3RpbWVvdXQ9MCZzaW5nbGVfdXNlX2Nvbm5lY3Rpb25zPXRydWUmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MSZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc2luZ2xlX3VzZV9jb25uZWN0aW9ucz10cnVlJnNvY2tldF90aW1lb3V0PTAifQ"