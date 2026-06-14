import { create } from 'zustand';
import type { Treasure, Route, CheckinRecord, FilterOptions } from '@/types';
import { treasures as mockTreasures, routes as mockRoutes } from '@/data/treasures';

interface AppState {
  treasures: Treasure[];
  routes: Route[];
  favoriteTreasures: string[];
  favoriteRoutes: string[];
  checkinRecords: CheckinRecord[];
  filters: FilterOptions;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  toggleFavoriteTreasure: (id: string) => void;
  toggleFavoriteRoute: (id: string) => void;
  addCheckin: (record: Omit<CheckinRecord, 'id'>) => void;
  getFilteredTreasures: () => Treasure[];
  getTreasureById: (id: string) => Treasure | undefined;
  getRouteById: (id: string) => Route | undefined;
}

const initialFilters: FilterOptions = {
  walkDuration: '',
  budget: '',
  isRainy: false,
  isKidFriendly: false,
  category: ''
};

export const useAppStore = create<AppState>((set, get) => ({
  treasures: mockTreasures,
  routes: mockRoutes,
  favoriteTreasures: ['1', '3'],
  favoriteRoutes: ['1'],
  checkinRecords: [
    {
      id: '1',
      treasureId: '1',
      treasureName: '老街糖水铺',
      date: '2024-01-15',
      photos: ['https://picsum.photos/id/292/400/400'],
      comment: '超好喝的糖水，老板人也很好！',
      rating: 5
    }
  ],
  filters: initialFilters,

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  resetFilters: () => set({ filters: initialFilters }),

  toggleFavoriteTreasure: (id) => set((state) => {
    const isFav = state.favoriteTreasures.includes(id);
    return {
      favoriteTreasures: isFav
        ? state.favoriteTreasures.filter(fid => fid !== id)
        : [...state.favoriteTreasures, id]
    };
  }),

  toggleFavoriteRoute: (id) => set((state) => {
    const isFav = state.favoriteRoutes.includes(id);
    return {
      favoriteRoutes: isFav
        ? state.favoriteRoutes.filter(fid => fid !== id)
        : [...state.favoriteRoutes, id]
    };
  }),

  addCheckin: (record) => set((state) => ({
    checkinRecords: [
      { ...record, id: Math.random().toString(36).substring(2, 9) },
      ...state.checkinRecords
    ]
  })),

  getFilteredTreasures: () => {
    const { treasures, filters } = get();
    return treasures.filter(t => {
      if (filters.category && t.category !== filters.category) return false;
      if (filters.isRainy && !t.isRainy) return false;
      if (filters.isKidFriendly && !t.isKidFriendly) return false;
      if (filters.budget && t.budget !== filters.budget) return false;
      if (filters.walkDuration) {
        const durationMap: Record<string, number> = {
          '15min': 15,
          '30min': 30,
          '45min': 45,
          '60min': 60
        };
        if (t.walkTime > durationMap[filters.walkDuration]) return false;
      }
      return true;
    });
  },

  getTreasureById: (id) => {
    return get().treasures.find(t => t.id === id);
  },

  getRouteById: (id) => {
    return get().routes.find(r => r.id === id);
  }
}));
