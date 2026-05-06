export interface Destination {
  id: string;
  name: string;
  country: string;
  coverPhotoUrl: string;
  shortDescription: string;
  dishes: Dish[];
}

export interface Dish {
  id: string;
  destinationId: string;
  name: string;
  localName: string;
  photoUrl: string;
  oneLiner: string;
  funFact?: string;
}

export interface DishCheck {
  id: string;
  user_id: string;
  dish_id: string;
  destination_id: string;
  tried_at: string;
  rating?: number;
  note?: string;
  photo_url?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  trigger: BadgeTrigger;
}

export type BadgeTrigger =
  | 'firstDish'
  | 'cityComplete'
  | 'globetrotter'
  | 'fiveRatings'
  | 'snapHappy';

export interface DestinationProgress {
  destinationId: string;
  name: string;
  country: string;
  coverPhotoUrl: string;
  triedCount: number;
  totalCount: number;
  recentPhotos: string[];
}

export interface PassportStats {
  totalDishes: number;
  countriesVisited: number;
  badges: Array<Badge & { unlocked: boolean }>;
  destinationProgress: DestinationProgress[];
}
