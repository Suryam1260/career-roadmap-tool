# Career Roadmap Tool

A personalized career roadmap generator that helps tech professionals and career switchers create a detailed plan to reach their target role.

## Features

- **Smart Quiz Flow**: 2-screen quiz to capture user background and skills
- **Dynamic Skill Assessment**: Radar chart showing current vs target skills
- **Learning Path**: Personalized roadmap with phases and milestones
- **Company Insights**: Company types, interview rounds, and selection process
- **Project Recommendations**: Curated project ideas by difficulty tier
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 13 (Pages Router)
- **Styling**: Tailwind CSS + Styled Components
- **State Management**: React Context API (Unified Context)
- **Charts**: Recharts (Radar charts for skill visualization)
- **Icons**: Phosphor React
- **UI Components**: Radix UI + shadcn/ui

## Local Development

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Deployment on Render

### Step 1: Push to GitHub

```bash
# If not already done:
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Scaler-LLM-Experiments/Career-RoadMap-Tool`
4. Configure the service:

   **Basic Settings:**
   - Name: `career-roadmap-tool`
   - Region: `Oregon (US West)`
   - Branch: `main`
   - Root Directory: `.` (leave empty as we're deploying from root)
   - Runtime: `Node`

   **Build & Deploy Settings:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

   **Environment:**
   - Node Version: `18`

   **Advanced:**
   - Auto-Deploy: `Yes` (deploys automatically on git push)

5. Click **"Create Web Service"**

### Step 3: Environment Variables (if needed)

If you need to add environment variables:
- Go to your service → **Environment** tab
- Add variables like `NODE_ENV=production`

### Step 4: Custom Domain (Optional)

1. Go to **Settings** → **Custom Domains**
2. Add your domain (e.g., `roadmap.scaler.com`)
3. Update DNS records as shown by Render

## Project Structure

```
frontend/
├── pages/                    # Next.js pages
│   ├── _app.js              # App wrapper with providers
│   ├── index.js             # Home page (Quiz)
│   ├── quiz.js              # Quiz page
│   └── roadmap-new.js       # Roadmap results
├── src/
│   ├── components/          # React components
│   │   ├── quiz/           # Quiz UI components
│   │   ├── roadmap/        # Roadmap components
│   │   └── roadmap-new/    # New roadmap design
│   ├── context/            # React Context (State management)
│   ├── data/               # JSON data files
│   ├── utils/              # Utility functions
│   └── index.css           # Global styles
├── public/                  # Static assets
└── tailwind.config.js      # Tailwind configuration
```

## Key Components

- **UnifiedContext**: Centralized state management combining profile + roadmap data
- **QuizOrchestrator**: Handles quiz flow and question progression
- **SkillMapNew**: Radar chart visualization of current vs target skills
- **CompanyTicker**: Animated company logos ticker
- **Hero**: Landing section with user stats and founder video

## Backend

The backend folder contains Python utility files for skill analysis:
- `skills_analysis.py`: Skill prioritization algorithms
- `priority_data.py`: Priority data for different roles

These are currently reference files. For production, skill analysis runs on the frontend.

## Notes

- The app uses **mock data** for development. Future integration with Scaler.com API is planned.
- All routes redirect to `/roadmap-new` after quiz completion
- Mobile-first responsive design with Tailwind breakpoints

## Support

For issues or questions, contact the Scaler LLM Experiments team.
