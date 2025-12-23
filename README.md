# Journey Through Matthew - Jaago

A journey-based quiz game that narrates the life of Jesus as presented in the Gospel of Matthew. Built for the Jaago faith-based event.

## Features

- **15 Sequential Levels**: Journey through key events from the Gospel of Matthew in chronological order
- **Voice Input**: Register your name using voice recognition (with on-screen keyboard fallback)
- **Interactive Quiz**: Multiple-choice questions with timer-based scoring
- **Security Verification**: 6-digit code system to verify completion
- **Score System**: Accuracy + time bonus scoring with millisecond precision for tie-breaking
- **Dark Theme**: Beautiful dark mode interface with smooth animations
- **Responsive Design**: Works on laptops, desktops, and tablets

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Supabase** for database
- **Web Speech API** for voice input

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd journey-through-matthew
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - Run the SQL from `supabase-schema.sql` to create the `game_sessions` table

5. Add the Jaago logo:
   - Place your `jaago.png` logo file in the `public/` directory
   - The logo should be optimized for web (recommended: 200x200px or larger, PNG format)

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── register/             # Player registration
│   ├── quiz/                 # Quiz gameplay
│   ├── verify/               # Security code verification
│   ├── forgot-code/          # Prayer recitation page
│   ├── results/               # Score reveal and completion
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # Reusable UI components
│   └── game/                  # Game-specific components
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── questions.ts           # Question data
│   └── scoring.ts             # Scoring logic
├── hooks/
│   └── useGameState.ts        # Game state management
└── types/
    └── game.ts                # TypeScript types
```

## Game Flow

1. **Landing Page** (`/`): Introduction and start button
2. **Registration** (`/register`): Voice input for name, location selection, security code generation
3. **Quiz** (`/quiz`): 15 questions with 30-second timer each
4. **Verification** (`/verify`): Re-enter security code
5. **Forgot Code** (`/forgot-code`): Prayer recitation if code is forgotten
6. **Results** (`/results`): Score reveal, inspirational quote, restart option

## Scoring System

- **Accuracy Score**: (Correct answers / Total questions) × 1000 points
- **Time Bonus**: Up to 500 points per question based on remaining time
  - Formula: `min(500, timeLeft × 16.67)`
  - 30 seconds remaining = 500 points
  - 0 seconds remaining = 0 points
- **Final Score**: Accuracy + Time Bonus (with millisecond precision for tie-breaking)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Voice input requires a browser that supports Web Speech API (Chrome, Edge recommended).

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Self-hosted with Node.js

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Database Schema

The `game_sessions` table stores:
- Player information (name, location)
- Security code
- All question answers with timing
- Calculated scores
- Completion timestamp

See `supabase-schema.sql` for the complete schema.

## License

This project is built for the Jaago event.

## Support

For issues or questions, please contact the development team.
