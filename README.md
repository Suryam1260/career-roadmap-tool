# Career Roadmap Tool

A personalized career development roadmap generator for tech professionals. Built with Next.js, React, and Tailwind CSS.

## Features

- **Personalized Roadmaps**: Generate custom learning paths based on your background, experience, and career goals
- **Skill Gap Analysis**: Identify missing skills with priority recommendations
- **Company Insights**: Get fit analysis for different company types (Startups, Mid-size, Big-Tech)
- **Learning Path**: Phased timeline with curated resources
- **Project Recommendations**: Portfolio-building project ideas

## Tech Stack

- **Framework**: Next.js 13 (Pages Router)
- **UI**: React 18, Tailwind CSS, Styled Components
- **Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Icons**: Phosphor React, Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
cd frontend
npm run build
npm start
```

## Project Structure

```
├── frontend/
│   ├── pages/              # Next.js pages
│   │   ├── index.js        # Landing/Quiz page
│   │   └── roadmap-experimental-v2.js  # Roadmap results
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── quiz/       # Quiz flow components
│   │   │   ├── roadmap-new/# Roadmap components
│   │   │   └── ui/         # Reusable UI components
│   │   ├── context/        # React context (UnifiedContext)
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
│   ├── public/
│   │   └── personas/       # Persona JSON files
│   └── experimental/       # Experimental roadmap sections
└── backend/                # Backend API (optional)
```

## How It Works

1. **Quiz**: Users answer questions about their background, experience, and career goals
2. **Persona Matching**: System determines the appropriate persona file based on responses
3. **Roadmap Generation**: Personalized roadmap is generated with:
   - Skill recommendations (prioritized by importance)
   - Company fit analysis
   - Learning path with phases
   - Project recommendations

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
