export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分` : `${hours}小时`;
};

export const formatBudget = (budget: string): string => {
  const budgetMap: Record<string, string> = {
    free: '免费',
    low: '¥0-50',
    medium: '¥50-150',
    high: '¥150+'
  };
  return budgetMap[budget] || budget;
};

export const getCategoryLabel = (category: string): string => {
  const categoryMap: Record<string, string> = {
    food: '美食小店',
    shop: '特色小店',
    exhibition: '街角展览',
    park: '口袋公园',
    viewpoint: '观景点',
    cafe: '咖啡馆'
  };
  return categoryMap[category] || category;
};

export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    food: '#FF7A45',
    shop: '#9B59B6',
    exhibition: '#4080FF',
    park: '#36B37E',
    viewpoint: '#F7BA1E',
    cafe: '#E67E22'
  };
  return colorMap[category] || '#FF7A45';
};

export const getWalkDurationLabel = (duration: string): string => {
  const map: Record<string, string> = {
    '15min': '15分钟内',
    '30min': '30分钟内',
    '45min': '45分钟内',
    '60min': '1小时内'
  };
  return map[duration] || duration;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export interface ShareContent {
  title: string;
  path: string;
  imageUrl: string;
  desc?: string;
}

export const buildTreasureShareContent = (treasure: {
  id: string;
  name: string;
  coverImage: string;
  address: string;
  rating: number;
  budgetDesc: string;
}): ShareContent => {
  return {
    title: `发现宝藏：${treasure.name}`,
    path: `/pages/detail/index?id=${treasure.id}`,
    imageUrl: treasure.coverImage,
    desc: `📍 ${treasure.address} ⭐ ${treasure.rating}分 💰 ${treasure.budgetDesc}`
  };
};

export const buildRouteShareContent = (route: {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  totalDistance: number;
  totalTime: number;
  treasureIds: string[];
}): ShareContent => {
  return {
    title: `周末路线：${route.name}`,
    path: `/pages/route-detail/index?id=${route.id}`,
    imageUrl: route.coverImage,
    desc: `${route.treasureIds.length}个地点 · ${formatDistance(route.totalDistance)} · 步行约${formatTime(route.totalTime)}`
  };
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (e) {
    console.error('[Utils] copyToClipboard error:', e);
    return false;
  }
};
