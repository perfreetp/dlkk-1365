export type TreasureCategory = 'food' | 'shop' | 'exhibition' | 'park' | 'viewpoint' | 'cafe';

export type BudgetLevel = 'free' | 'low' | 'medium' | 'high';

export type WalkDuration = '15min' | '30min' | '45min' | '60min';

export interface Treasure {
  id: string;
  name: string;
  category: TreasureCategory;
  coverImage: string;
  images: string[];
  address: string;
  distance: number;
  walkTime: number;
  budget: BudgetLevel;
  budgetDesc: string;
  isRainy: boolean;
  isKidFriendly: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  highlights: string[];
  openTime: string;
  tips: string[];
  photoSpots: string[];
  nearbySupplies: string[];
  description: string;
  lat: number;
  lng: number;
  stayTime: number;
}

export interface Route {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  treasureIds: string[];
  totalDistance: number;
  totalTime: number;
  totalStayTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isRecommended: boolean;
  isFavorite: boolean;
  tags: string[];
}

export interface CheckinRecord {
  id: string;
  treasureId: string;
  treasureName: string;
  date: string;
  photos: string[];
  comment: string;
  rating: number;
}

export interface FilterOptions {
  walkDuration: WalkDuration | '';
  budget: BudgetLevel | '';
  isRainy: boolean;
  isKidFriendly: boolean;
  category: TreasureCategory | '';
}

export type TabType = 'home' | 'explore' | 'routes' | 'favorites' | 'mine';
