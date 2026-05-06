import { Badge, BadgeTrigger, Destination, DishCheck } from "../types";

export const BADGES: Badge[] = [
  {
    id: "first_bite",
    name: "First bite",
    description: "Check off your first dish ever",
    emoji: "🍴",
    trigger: "firstDish",
  },
  {
    id: "passport_stamped",
    name: "Passport stamped",
    description: "Try every dish in a single city",
    emoji: "🛂",
    trigger: "cityComplete",
  },
  {
    id: "globetrotter",
    name: "Globetrotter",
    description: "Try dishes in 2 different countries",
    emoji: "🌍",
    trigger: "globetrotter",
  },
  {
    id: "critic",
    name: "The critic",
    description: "Rate 5 different dishes",
    emoji: "⭐",
    trigger: "fiveRatings",
  },
  {
    id: "snap_happy",
    name: "Snap happy",
    description: "Add a photo to 3 check-offs",
    emoji: "📸",
    trigger: "snapHappy",
  },
];

export function evaluateBadges(
  checks: DishCheck[],
  destinations: Destination[],
): Array<Badge & { unlocked: boolean }> {
  const countries = new Set(
    checks.map((c) => {
      const dest = destinations.find((d) => d.id === c.destination_id);
      return dest?.country;
    }),
  );

  return BADGES.map((badge) => ({
    ...badge,
    unlocked: isBadgeUnlocked(badge.trigger, checks, countries, destinations),
  }));
}

function isBadgeUnlocked(
  trigger: BadgeTrigger,
  checks: DishCheck[],
  countries: Set<string | undefined>,
  destinations: Destination[],
): boolean {
  switch (trigger) {
    case "firstDish":
      return checks.length > 0;

    case "cityComplete":
      return destinations.some((dest) => {
        const triedIds = new Set(
          checks
            .filter((c) => c.destination_id === dest.id)
            .map((c) => c.dish_id),
        );
        return dest.dishes.every((d) => triedIds.has(d.id));
      });

    case "globetrotter":
      return countries.size >= 2;

    case "fiveRatings":
      return checks.filter((c) => c.rating != null).length >= 5;

    case "snapHappy":
      return checks.filter((c) => c.photo_url != null).length >= 3;
  }
}
