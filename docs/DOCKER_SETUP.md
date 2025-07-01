# DeFi Guard Docker Setup

This docker-compose.yml sets up the complete DeFi Guard ecosystem with the following services:

## Services Overview

### Frontend Service
- **Service**: `defi-guard-frontend`
- **Port**: 3000 (external) → 80 (internal)
- **Description**: React frontend application served by Nginx

### Backend Services

#### 1. Threat Intelligence & OSINT Service
- **Service**: `defi-guard-threat-intel`
- **Repository**: https://github.com/NeerajHazarika/defi-guard-threat-intel-osint
- **Port**: 8000 (external) → 8000 (internal)
- **Description**: Handles threat intelligence and OSINT data processing

#### 2. Stable Coin Monitor Service
- **Service**: `defi-guard-stablecoin-monitor`
- **Repository**: https://github.com/NeerajHazarika/defi-guard-stable-coin-monitor
- **Port**: 8001 (external) → 8000 (internal)
- **Description**: Monitors stable coin activities and metrics

### Infrastructure Services

#### Database
- **Service**: `db`
- **Image**: PostgreSQL 15 Alpine
- **Port**: 5432 (internal only)
- **Database**: `defi_guard`

#### Cache
- **Service**: `redis`
- **Image**: Redis 7 Alpine
- **Port**: 6379 (internal only)

## Quick Start

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **Stop and remove volumes:**
   ```bash
   docker-compose down -v
   ```

## Service URLs

- **Frontend**: http://localhost:3000
- **Threat Intel API**: http://localhost:8000
- **Stablecoin Monitor API**: http://localhost:8001

## Environment Variables

Both backend services use the following environment variables:
- `NODE_ENV=production`
- `DATABASE_URL=postgresql://user:password@db:5432/defi_guard`
- `REDIS_URL=redis://redis:6379`

## Health Checks

All services include health checks:
- **Frontend**: Checks if Nginx is responding
- **Backend Services**: Checks if the API endpoints are healthy
- **Database**: Uses `pg_isready` to check PostgreSQL status
- **Redis**: Uses `redis-cli ping` to check Redis status

## Notes

- The backend services are built directly from their GitHub repositories
- All services are connected via the `defi-guard-network` bridge network
- Data persistence is handled through Docker volumes for PostgreSQL and Redis
- Services will automatically restart unless manually stopped
