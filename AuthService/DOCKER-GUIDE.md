# AuthService - Docker Setup Guide

Simple guide to run AuthService with Docker.

## What You Need
- Docker Desktop installed on Windows

## Files Overview
- `Dockerfile` - Instructions to build your application image
- `docker-compose.yml` - Runs both AuthService and PostgreSQL database together

## Quick Start

### Step 1: Start Everything

Open PowerShell in your project folder and run:

```powershell
docker-compose up --build
```

This will:
- Download PostgreSQL image
- Build your AuthService
- Start both containers

**Wait until you see:** "Started AuthServiceApplication"

### Step 2: Test Your Service

Open a new PowerShell window and test:

```powershell
# Check health
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/health"

# Test login
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"username":"testuser","password":"password123"}'
```

### Step 3: Stop Everything

Press `Ctrl+C` in the terminal, then run:

```powershell
docker-compose down
```

## Common Commands

### Start in background
```powershell
docker-compose up -d
```

### View logs
```powershell
docker-compose logs -f authservice
```

### Stop services
```powershell
docker-compose stop
```

### Remove everything (including database data)
```powershell
docker-compose down -v
```

### Rebuild after code changes
```powershell
docker-compose up --build
```

## Access Points
- **AuthService API:** http://localhost:8080
- **PostgreSQL Database:** localhost:5432
  - Database: `auth_db`
  - Username: `user`
  - Password: `password`

## Troubleshooting

### Port already in use
If port 8080 or 5432 is busy, change in `docker-compose.yml`:
```yaml
ports:
  - "8081:8080"  # Use 8081 instead
```

### See what's running
```powershell
docker ps
```

### Check logs if something fails
```powershell
docker-compose logs
```

### Start fresh (delete everything)
```powershell
docker-compose down -v
docker system prune -a
```

## What Happens When You Run

1. Docker downloads PostgreSQL image
2. Docker builds your Java application
3. PostgreSQL starts first
4. AuthService connects to PostgreSQL
5. Your API is ready at port 8080

## Next Steps

Once comfortable, you can:
- Change database credentials in `docker-compose.yml`
- Modify Java code and rebuild with `docker-compose up --build`
- Add more services to `docker-compose.yml`

That's it! You now have a working microservice with Docker! 🎉

