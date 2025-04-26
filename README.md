# MaturaMate

An interactive platform for exam preparation and practice.

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

## Deployment

This project is configured for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and create a new project
3. Connect your GitHub repository
4. Add the following environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

## Features

- Interactive exercises with step-by-step solutions
- Virtual tutor powered by AI
- Progress tracking
- Exercise bookmarking
- Comprehensive statistics
- User authentication
- Responsive design 