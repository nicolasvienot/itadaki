# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start          # Start Expo dev server
yarn ios            # Run on iOS simulator
yarn android        # Run on Android emulator
yarn web            # Run in browser
```

There are no lint or test scripts configured.

## Environment

Create a `.env.local` (or `.env`) at the root with:

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

## Architecture

**Routing** — Expo Router (file-based). The entry is `app/_layout.tsx` which wraps everything in `QueryClientProvider`. Tab screens live in `app/(tabs)/`. Detail screens are `app/destination/[id].tsx`, `app/dish/[destinationId]/[dishId].tsx`, and `app/capture/[dishId].tsx` (modal).

**App flow** — On launch, `app/(tabs)/_layout.tsx` checks `SecureStore` for a stored `activeDestinationId`. If none exists and onboarding isn't complete, it redirects to `/onboarding`. Onboarding writes the chosen destination to both Zustand + SecureStore + Supabase `active_destinations`.

**State** — Two layers:
- `src/store/useAppStore.ts` (Zustand): lightweight global state for `activeDestinationId` and `onboardingComplete`, persisted via `expo-secure-store`. The `hydrate()` action is called once at startup in `app/_layout.tsx`.
- TanStack React Query (`src/lib/queryClient.ts`): all remote data. Hooks live in `src/hooks/`. Destinations + dishes are fetched together in `useDestinations` (1-hour staleTime); user dish checks per destination in `useDestinationDetail`; mutations in `useCheckOff`.

**Backend** — Supabase with anonymous auth (users are created silently via `ensureAnonymousSession` at startup). Two tables: `dish_checks` (user progress, ratings, notes, photo URLs) and `active_destinations`. RLS is enforced on both — all queries require a valid session. Photos upload to the `dish-photos` public storage bucket.

**SecureStore chunking** — `src/lib/supabase.ts` implements a custom storage adapter that splits values > 1800 bytes across multiple SecureStore keys, because Supabase JWTs can exceed the 2KB limit.

**UI conventions**:
- Design tokens in `src/constants/colors.ts` — always import `colors` and `typography` from there; never hardcode values.
- Two typefaces: `PlayfairDisplay` (serif headings) and `Inter` (body text).
- All screens use `StyleSheet.create` + inline styles. NativeWind is installed but not actively used.
- `src/components/ScreenHeader.tsx` is the shared back-button header for all non-tab screens. It supports a solid (`cream` background) and `overlay` (floating/transparent) mode. When a title is present, a `spacer` view mirrors the button width to keep the title optically centered — adjust both if changing padding.
- Tab bar is a floating pill with `BlurView` on iOS and a semi-transparent fallback on Android.

**Path aliases** — `@/*` maps to the repo root, `@src/*` maps to `src/`.

## Supabase schema

```
dish_checks   — id, user_id, dish_id, destination_id, tried_at, rating (1-5), note, photo_url
active_destinations — user_id, destination_id, added_at
```

Catalog data (`destinations`, `dishes`) lives in Supabase tables too (see `supabase/migrations/20241201000002_catalog.sql`) and is read-only from the client.
