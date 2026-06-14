import { create } from 'zustand';
import Taro from '@tarojs/taro';
import type { Treasure, Route, CheckinRecord, FilterOptions } from '@/types';
import { treasures as mockTreasures, routes as mockRoutes } from '@/data/treasures';
import { generateId } from '@/utils';

const STORAGE_KEYS = {
  FAVORITE_TREASURES: 'citywalk_favorite_treasures',
  FAVORITE_ROUTES: 'citywalk_favorite_routes',
  CHECKIN_RECORDS: 'citywalk_checkin_records',
  CUSTOM_ROUTES: 'citywalk_custom_routes'
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = Taro.getStorageSync(key);
    if (data) {
      return JSON.parse(data) as T;
    }
  } catch (e) {
    console.error('[Store] loadFromStorage error:', key, e);
  }
  return defaultValue;
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    Taro.setStorageSync(key, JSON.stringify(value));
  } catch (e) {
    console.error('[Store] saveToStorage error:', key, e);
  }
};

interface AppState {
  treasures: Treasure[];
  routes: Route[];
  customRoutes: Route[];
  favoriteTreasures: string[];
  favoriteRoutes: string[];
  checkinRecords: CheckinRecord[];
  filters: FilterOptions;
  hydrateFromStorage: () => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  toggleFavoriteTreasure: (id: string) => void;
  toggleFavoriteRoute: (id: string) => void;
  addCheckin: (record: Omit<CheckinRecord, 'id'>) => void;
  addCustomRoute: (route: Omit<Route, 'id' | 'isFavorite'>) => void;
  deleteCustomRoute: (id: string) => void;
  getAllRoutes: () => Route[];
  getFilteredTreasures: () => Treasure[];
  getTreasureById: (id: string) => Treasure | undefined;
  getRouteById: (id: string) => Route | undefined;
  getCheckinById: (id: string) => CheckinRecord | undefined;
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
  customRoutes: [],
  favoriteTreasures: loadFromStorage<string[]>(STORAGE_KEYS.FAVORITE_TREASURES, ['1', '3']),
  favoriteRoutes: loadFromStorage<string[]>(STORAGE_KEYS.FAVORITE_ROUTES, ['1']),
  checkinRecords: loadFromStorage<CheckinRecord[]>(STORAGE_KEYS.CHECKIN_RECORDS, [
    {
      id: '1',
      treasureId: '1',
      treasureName: '老街糖水铺',
      date: '2024-01-15',
      photos: ['https://picsum.photos/id/292/400/400'],
      comment: '超好喝的糖水，老板人也很好！',
      rating: 5
    }
  ]),
  filters: initialFilters,

  hydrateFromStorage: () => {
    set({
      favoriteTreasures: loadFromStorage<string[]>(STORAGE_KEYS.FAVORITE_TREASURES, ['1', '3']),
      favoriteRoutes: loadFromStorage<string[]>(STORAGE_KEYS.FAVORITE_ROUTES, ['1']),
      checkinRecords: loadFromStorage<CheckinRecord[]>(STORAGE_KEYS.CHECKIN_RECORDS, []),
      customRoutes: loadFromStorage<Route[]>(STORAGE_KEYS.CUSTOM_ROUTES, [])
    });
  },

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  resetFilters: () => set({ filters: initialFilters }),

  toggleFavoriteTreasure: (id) => set((state) => {
    const isFav = state.favoriteTreasures.includes(id);
    const newFavorites = isFav
      ? state.favoriteTreasures.filter(fid => fid !== id)
      : [...state.favoriteTreasures, id];
    saveToStorage(STORAGE_KEYS.FAVORITE_TREASURES, newFavorites);
    return { favoriteTreasures: newFavorites };
  }),

  toggleFavoriteRoute: (id) => set((state) => {
    const isFav = state.favoriteRoutes.includes(id);
    const newFavorites = isFav
      ? state.favoriteRoutes.filter(fid => fid !== id)
      : [...state.favoriteRoutes, id];
    saveToStorage(STORAGE_KEYS.FAVORITE_ROUTES, newFavorites);
    return { favoriteRoutes: newFavorites };
  }),

  addCheckin: (record) => set((state) => {
    const newRecords = [
      { ...record, id: generateId() },
      ...state.checkinRecords
    ];
    saveToStorage(STORAGE_KEYS.CHECKIN_RECORDS, newRecords);
    return { checkinRecords: newRecords };
  }),

  addCustomRoute: (route) => set((state) => {
    const newRoute: Route = {
      ...route,
      id: generateId(),
      isFavorite: false
    };
    const newCustomRoutes = [newRoute, ...state.customRoutes];
    saveToStorage(STORAGE_KEYS.CUSTOM_ROUTES, newCustomRoutes);
    return { customRoutes: newCustomRoutes };
  }),

  deleteCustomRoute: (id) => set((state) => {
    const newCustomRoutes = state.customRoutes.filter(r => r.id !== id);
    saveToStorage(STORAGE_KEYS.CUSTOM_ROUTES, newCustomRoutes);
    const newFavRoutes = state.favoriteRoutes.filter(fid => fid !== id);
    saveToStorage(STORAGE_KEYS.FAVORITE_ROUTES, newFavRoutes);
    return { customRoutes: newCustomRoutes, favoriteRoutes: newFavRoutes };
  }),

  getAllRoutes: () => {
    const { routes, customRoutes } = get();
    return [...customRoutes, ...routes];
  },

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
    return get().getAllRoutes().find(r => r.id === id);
  },

  getCheckinById: (id) => {
    return get().checkinRecords.find(r => r.id === id);
  }
}));
