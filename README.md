# 🍿 usePopcorn (Next.js Edition)

A modern, fast, and responsive movie discovery application built with **Next.js**, **React 19**, and **Tailwind CSS**. Search for movies, explore genres, check top-rated and trending films, and get personalized recommendations.

Based on the classic "usePopcorn" project, but fully upgraded and architected for the modern web using the **Next.js App Router** and server-side API routes.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Testing:** [Vitest](https://vitest.dev/) & React Testing Library
- **Data Source:** [TMDB API](https://developer.themoviedb.org/docs)

## ✨ Features

- **Movie Discovery:** Browse Trending, Top Rated, and Discover categories.
- **Search & Command Palette:** Quickly search for your favorite movies.
- **Genre Filtering:** Filter movies dynamically based on specific genres.
- **Detailed Movie Views:** View posters, synopses, cast (if applicable), and user ratings.
- **Recommendations:** Get related movie recommendations based on what you view.
- **Custom Rating System:** Interactive star rating component.
- **Local Storage Support:** Saves user preferences or viewing history (via custom hooks).
- **Backend API Routes:** Securely fetches data from TMDB without exposing API keys on the client.

## 📂 Project Structure

```text
├── app/
│   ├── api/          # Next.js Serverless API routes (TMDB proxy)
│   ├── layout.tsx    # Global layout and fonts
│   └── page.tsx      # Main application entry point
├── components/       # Reusable UI components (Hero, MovieGrid, StarRating, etc.)
├── hooks/            # Custom React hooks (useMovies, useGenres, etc.)
├── lib/              # Core logic, TMDB helpers, and data mappers
├── services/         # External API service integrations
├── types/            # TypeScript interfaces and type definitions
└── utils/            # Helper utilities (e.g., TMDB image formatting)
```

## 🛠️ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### 1. Clone the repository

```bash
git clone https://github.com/your-username/usepopcorn-next.git
cd usepopcorn-next
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Create a `.env.local` file in the root directory. You will need an API key from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api).

```env
# .env.local
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
```
*(Note: Check `.env.example` if available for all required variables).*

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing

This project uses **Vitest** for unit and integration testing.

- Run tests once:
  ```bash
  npm run test:ci
  ```
- Run tests in watch mode:
  ```bash
  npm test
  ```

## 🏗️ Build for Production

To build the app for production, run:

```bash
npm run build
```
Then, to start the production server:
```bash
npm run start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.