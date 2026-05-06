# Itadaki

Pick a city. Eat your way through it.

Itadaki is a mobile food passport app. Choose a destination, work through its curated list of iconic dishes, rate and photograph what you try, and earn badges as you go. Create an account to sync your progress across devices or stay anonymous — your call.

## Tech

- Expo 54 / React Native
- Expo Router (file-based navigation)
- Supabase (anonymous auth + email/password signup, Postgres, Storage)
- TanStack React Query
- Zustand

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

3. In your Supabase project:
   - Enable **Anonymous sign-ins** and **Email/Password** (Authentication → Providers)
   - Run the migrations in `supabase/migrations/` in order
   - Create a public storage bucket named `dish-photos`

## Development

```bash
yarn ios       # iOS simulator
yarn android   # Android emulator
yarn web       # Browser
yarn start     # Expo dev server (scan QR with Expo Go)
```
