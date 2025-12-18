# Career Roadmap Tool - Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Elastic Beanstalk                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Docker Compose                    │   │
│  │  ┌─────────┐    ┌───────────┐    ┌─────────────┐   │   │
│  │  │  nginx  │───▶│  Next.js  │    │   FastAPI   │   │   │
│  │  │  :80    │    │   :3000   │    │    :8000    │   │   │
│  │  └────┬────┘    └───────────┘    └──────┬──────┘   │   │
│  │       │                                  │          │   │
│  │       │     /career-roadmap-tool/api/*   │          │   │
│  │       └──────────────────────────────────┘          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   AWS RDS        │
                    │   PostgreSQL     │
                    └──────────────────┘
```

## Prerequisites

1. AWS CLI configured with appropriate permissions
2. EB CLI installed (`pip install awsebcli`)
3. Existing RDS PostgreSQL instance (same as career-profile-evaluation)

## Initial Setup

### 1. Initialize Elastic Beanstalk

```bash
cd career-roadmap-tool

# Initialize EB application
eb init career-roadmap-tool --platform docker --region ap-south-1

# Create environment
eb create crt-prod --single --instance-type t3.small
```

### 2. Configure Environment Variables

Set these in the EB console or via CLI:

```bash
eb setenv \
  DATABASE_URL="postgresql://username:password@your-rds-endpoint:5432/profile_cache" \
  ENVIRONMENT="production" \
  LOG_LEVEL="INFO"
```

### 3. Create Database Table

Connect to RDS and run the init script:

```bash
psql $DATABASE_URL -f backend/init.sql
```

Or if the table already exists in the shared RDS, the script will skip creation.

## Deployment

### Standard Deployment

```bash
# Deploy to Elastic Beanstalk
eb deploy
```

### Using Production Compose File

For production deployment without local Postgres:

```bash
# Rename compose file for EB
cp docker-compose.prod.yml docker-compose.yml
eb deploy

# Restore for local development
git checkout docker-compose.yml
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string to RDS | Yes |
| `ENVIRONMENT` | `production` or `development` | No (default: production) |
| `LOG_LEVEL` | Logging level (`DEBUG`, `INFO`, `WARNING`) | No (default: INFO) |
| `ALLOWED_ORIGINS` | CORS allowed origins | No (default: *) |

## Health Checks

- **Nginx**: `GET /health` → `200 OK`
- **Backend API**: `GET /career-roadmap-tool/api/health` → `{"status": "ok"}`
- **Frontend**: `GET /career-roadmap-tool` → Next.js app

## Monitoring

### View Logs

```bash
# All logs
eb logs

# Specific container
eb ssh
docker logs crt-backend
docker logs crt-frontend
docker logs crt-nginx
```

### Check Container Status

```bash
eb ssh
docker ps
docker-compose ps
```

## Rollback

```bash
# List deployments
eb appversion

# Rollback to previous version
eb deploy --version <version-label>
```

## Migration from AWS Amplify

1. **Remove Amplify**: Delete the Amplify app from AWS Console
2. **Update DNS**: Point your domain to the new EB environment URL
3. **Update LeadSquared**: Update admin URLs if the domain changes

## Local Development vs Production

| Aspect | Local (docker-compose.yml) | Production (docker-compose.prod.yml) |
|--------|---------------------------|-------------------------------------|
| Database | Local PostgreSQL container | AWS RDS |
| Port | 80 (nginx) | 80 (nginx) |
| Frontend API URL | `http://localhost:8002` | Same origin (empty) |
| Postgres exposed | Yes (5433) | No |

## Troubleshooting

### Container won't start

```bash
eb ssh
docker-compose logs <service-name>
```

### Database connection issues

1. Check security groups allow EB to connect to RDS
2. Verify DATABASE_URL is correct
3. Check RDS is in the same VPC or has public access

### 502 Bad Gateway

1. Check if backend container is healthy
2. Check nginx logs: `docker logs crt-nginx`
3. Verify health check endpoints are responding

## Cost Optimization

- Use `t3.small` or `t3.micro` for low traffic
- Consider Reserved Instances for production
- Use the same RDS instance as career-profile-evaluation to share costs

