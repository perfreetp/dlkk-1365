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
