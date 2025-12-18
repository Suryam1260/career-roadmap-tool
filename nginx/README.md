
# Career Roadmap Tool

A personalized career development roadmap generator for tech professionals. Built with Next.js, React, and Tailwind CSS.

## Features

- **Personalized Roadmaps**: Generate custom learning paths based on your background, experience, and career goals
- **Skill Gap Analysis**: Identify missing skills with priority recommendations
- **Company Insights**: Get fit analysis for different company types (Startups, Mid-size, Big-Tech)
- **Learning Path**: Phased timeline with curated resources
- **Project Recommendations**: Portfolio-building project ideas
- **Admin View**: Share roadmaps via unique URLs for admin review

## Tech Stack

### Frontend
- **Framework**: Next.js 13 (Pages Router)
- **UI**: React 18, Tailwind CSS, Styled Components
- **Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Icons**: Phosphor React, Lucide React
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Database**: PostgreSQL 15
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Docker & Docker Compose

### Local Development

**Option 1: Full Docker Stack** (recommended for testing production-like setup)

```bash
# Start all services (nginx + frontend + backend + postgres)
docker-compose up -d
```

- App: http://localhost:8080/career-roadmap-tool
- API: http://localhost:8080/career-roadmap-tool/api/health

**Option 2: Frontend on Host, Backend in Docker** (recommended for frontend development)

```bash
# Start backend and database only
docker-compose -f docker-compose.dev.yml up -d

# In another terminal, start frontend
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:3000/career-roadmap-tool
- Backend API: http://localhost:8002/career-roadmap-tool/api/health

### Build for Production

```bash
# Build all containers
docker-compose build

# Or build production version (without local postgres)
docker-compose -f docker-compose.prod.yml build
```

## Project Structure

```
├── frontend/
│   ├── pages/              # Next.js pages
│   │   ├── index.js        # Landing/Quiz page
│   │   ├── admin/          # Admin pages (roadmap.js)
│   │   └── roadmap-experimental-v2.js  # Roadmap results
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context (UnifiedContext)
│   │   ├── utils/          # Utility functions
│   │   │   └── roadmapApi.js  # Backend API client
│   │   └── styles/         # Global styles
│   ├── public/
│   │   └── personas/       # Persona JSON files
│   ├── experimental/       # Experimental roadmap sections
│   └── Dockerfile          # Frontend container (Next.js)
├── backend/
│   ├── main.py             # FastAPI application
│   ├── database.py         # Database connection & queries
│   ├── init.sql            # Database schema
│   ├── Dockerfile          # Backend container
│   └── requirements.txt    # Python dependencies
├── nginx/
│   ├── nginx.conf          # Nginx reverse proxy config
│   └── Dockerfile          # Nginx container
├── docker-compose.yml      # Full stack (nginx + frontend + backend + postgres)
├── docker-compose.dev.yml  # Dev mode (backend + postgres only)
├── docker-compose.prod.yml # Production (no local postgres)
└── DEPLOYMENT.md           # Deployment guide
```

## Deployment

The application is deployed on **AWS Elastic Beanstalk** using Docker Compose.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## How It Works

1. **Quiz**: Users answer questions about their background, experience, and career goals
2. **Persona Matching**: System determines the appropriate persona file based on responses
3. **Roadmap Generation**: Personalized roadmap is generated with:
   - Skill recommendations (prioritized by importance)
   - Company fit analysis
   - Learning path with phases
   - Project recommendations
4. **Session Storage**: Quiz responses are saved to backend, generating a unique MD5 hash
5. **Admin Access**: Unique URL with hash is sent to LeadSquared for admin review

## Admin Flow

When a user completes the quiz and generates their roadmap:

1. Frontend sends quiz responses to backend (`POST /career-roadmap-tool/api/session`)
2. Backend creates MD5 hash and stores data in PostgreSQL
3. Backend returns hash to frontend
4. Frontend sends admin URL (e.g., `/admin/roadmap?h=abc123...`) to LeadSquared
5. Admin opens URL, authenticates, and sees the same roadmap as the user

### Admin URL Format

- **New format (hash-based)**: `/admin/roadmap?h=<32-char-md5-hash>`
- **Legacy format (base64)**: `/admin/roadmap?d=<base64-encoded-data>` (backward compatible)

## Supported Roles

- Backend Engineer
- Frontend Engineer
- Fullstack Engineer
- DevOps Engineer
- Data Engineer

## License

Private - Scaler

## Contributing

Internal Scaler team only.
