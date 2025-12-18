# Career Roadmap Tool - Backend

Python FastAPI backend for storing and retrieving roadmap sessions.

## Overview

This backend provides a simple API for:
- Saving quiz responses with an MD5 hash as the session identifier
- Retrieving quiz responses by session hash (for admin viewing)

## Local Development

### Prerequisites

- Python 3.12+
- Docker & Docker Compose (recommended)
- PostgreSQL 15+ (if running without Docker)

### Quick Start with Docker

From the project root:

```bash
# Start backend and database
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

The API will be available at: http://localhost:8002

### Running Without Docker

1. Create virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database connection
```

4. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

## API Endpoints

All endpoints are prefixed with `/career-roadmap-tool/api`

### Health Check
```
GET /career-roadmap-tool/api/health
```

### Save Session
```
POST /career-roadmap-tool/api/session
Content-Type: application/json

{
  "quiz_responses": {
    "background": "tech",
    "targetRole": "backend",
    ...
  }
}

Response:
{
  "session_hash": "a1b2c3d4e5f6...",
  "admin_url_path": "/admin/roadmap?h=a1b2c3d4e5f6..."
}
```

### Get Session
```
GET /career-roadmap-tool/api/session/{session_hash}

Response:
{
  "quiz_responses": {...},
  "created_at": "2025-01-01T00:00:00",
  "updated_at": "2025-01-01T00:00:00"
}
```

### Stats
```
GET /career-roadmap-tool/api/stats
```

## Database Schema

The backend uses the `roadmap_sessions` table:

```sql
CREATE TABLE roadmap_sessions (
    id SERIAL PRIMARY KEY,
    session_hash VARCHAR(32) NOT NULL UNIQUE,
    quiz_responses JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Production Deployment

This backend is designed to be deployed on AWS Elastic Beanstalk, similar to the `career-profile-evaluation` project.

### Environment Variables for Production

- `DATABASE_URL`: PostgreSQL connection string to RDS
- `ENVIRONMENT`: Set to `production`
- `LOG_LEVEL`: Set to `INFO` or `WARNING`
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

### RDS Configuration

Uses the same RDS instance as `career-profile-evaluation`. The `init.sql` creates the `roadmap_sessions` table in the existing `profile_cache` database.

