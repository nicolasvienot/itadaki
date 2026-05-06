import { DishCheck, Destination, DestinationProgress, PassportStats } from '../types';
import { evaluateBadges } from '../constants/badges';

export function computeStats(checks: DishCheck[], destinations: Destination[]): PassportStats {
  const countries = new Set(
    checks.map((c) => {
      const dest = destinations.find((d) => d.id === c.destination_id);
      return dest?.country;
    }).filter(Boolean)
  );

  const destinationProgress: DestinationProgress[] = destinations.filter((dest) =>
    checks.some((c) => c.destination_id === dest.id)
  ).map((dest) => {
    const destChecks = checks.filter((c) => c.destination_id === dest.id);
    const triedIds = new Set(destChecks.map((c) => c.dish_id));
    const recentPhotos = destChecks
      .filter((c) => c.photo_url)
      .slice(-3)
      .map((c) => c.photo_url!);

    return {
      destinationId: dest.id,
      name: dest.name,
      country: dest.country,
      coverPhotoUrl: dest.coverPhotoUrl,
      triedCount: triedIds.size,
      totalCount: dest.dishes.length,
      recentPhotos,
    };
  });

  return {
    totalDishes: checks.length,
    countriesVisited: countries.size,
    badges: evaluateBadges(checks, destinations),
    destinationProgress,
  };
}
