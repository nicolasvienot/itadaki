# Itadaki

A food passport app — pick a city, eat your way through its iconic dishes, and track what you've tried.

## Tech

- Expo 54 / React Native
- Expo Router (file-based navigation)
- Supabase (anonymous auth, Postgres, Storage)
- TanStack React Query
- Zustand

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Create a `.env.local` at the root:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. In your Supabase project:
   - Enable **Anonymous sign-ins** (Authentication → Providers)
   - Run the migrations in `supabase/migrations/` in order
   - Create a public storage bucket named `dish-photos`

## Development

```bash
yarn ios       # iOS simulator
yarn android   # Android emulator
yarn web       # Browser
yarn start     # Expo dev server (scan QR with Expo Go)
```
