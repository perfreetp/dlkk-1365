import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import TreasureCard from '@/components/TreasureCard';
import FilterBar from '@/components/FilterBar';
import { useAppStore } from '@/store/useAppStore';
import type { FilterOptions, TreasureCategory } from '@/types';
import { getCategoryLabel } from '@/utils';

const HomePage: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>({
    walkDuration: '',
    budget: '',
    isRainy: false,
    isKidFriendly: false,
    category: ''
  });

  const {
    treasures,
    filters,
    favoriteTreasures,
    setFilters,
    resetFilters,
    toggleFavoriteTreasure,
    getFilteredTreasures
  } = useAppStore();

  const newTreasures = treasures.filter(t => t.isNew).slice(0, 5);
  const filteredTreasures = getFilteredTreasures();

  const categories: TreasureCategory[] = ['food', 'shop', 'exhibition', 'park', 'viewpoint', 'cafe'];
  const categoryIcons: Record<TreasureCategory, string> = {
    food: '🍜',
    shop: '🛍️',
    exhibition: '🎨',
    park: '🌳',
    viewpoint: '🏙️',
    cafe: '☕'
  };

  useDidShow(() => {
    console.log('[HomePage] page showed');
  });

  const handleSearch = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/search/index'
    });
  }, []);

  const handleCategoryClick = useCallback((category: TreasureCategory) => {
    setFilters({ category });
    Taro.navigateTo({
      url: '/pages/explore/index'
    });
  }, [setFilters]);

  const handleOpenFilter = useCallback(() => {
    setTempFilters({ ...filters });
    setShowFilter(true);
  }, [filters]);

  const handleCloseFilter = useCallback(() => {
    setShowFilter(false);
  }, []);

  const handleTempFilterChange = useCallback((newFilters: Partial<FilterOptions>) => {
    setTempFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setTempFilters({
      walkDuration: '',
      budget: '',
      isRainy: false,
      isKidFriendly: false,
      category: ''
    });
  }, []);

  const handleConfirmFilter = useCallback(() => {
    setFilters(tempFilters);
    setShowFilter(false);
  }, [tempFilters, setFilters]);

  const handlePullDownRefresh = useCallback(() => {
    console.log('[HomePage] pull down refresh');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  }, []);

  const hasActiveFilters = filters.category || filters.walkDuration || filters.budget || filters.isRainy || filters.isKidFriendly;

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.header}>
        <Text className={styles.greeting}>周末愉快 🌞</Text>
        <Text className={styles.title}>发现城市的小美好</Text>
        <View className={styles.searchBar} onClick={handleSearch}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchText}>搜索宝藏地点...</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>分类探索</Text>
        </View>
        <View className={styles.categoryRow}>
          {categories.slice(0, 3).map(cat => (
            <View
              key={cat}
              className={styles.categoryItem}
              onClick={() => handleCategoryClick(cat)}
            >
              <View className={styles.categoryIconWrap}>
                <Text className={styles.categoryIcon}>{categoryIcons[cat]}</Text>
              </View>
              <Text className={styles.categoryName}>{getCategoryLabel(cat)}</Text>
            </View>
          ))}
        </View>
        <View className={styles.categoryRow}>
          {categories.slice(3, 6).map(cat => (
            <View
              key={cat}
              className={styles.categoryItem}
              onClick={() => handleCategoryClick(cat)}
            >
              <View className={styles.categoryIconWrap}>
                <Text className={styles.categoryIcon}>{categoryIcons[cat]}</Text>
              </View>
              <Text className={styles.categoryName}>{getCategoryLabel(cat)}</Text>
            </View>
          ))}
        </View>
      </View>

      {newTreasures.length > 0 && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>✨ 本周新上榜</Text>
            <Text className={styles.moreBtn}>查看全部 ›</Text>
          </View>
          <ScrollView scrollX className={styles.newTreasures} enhanced showScrollbar={false}>
            {newTreasures.map(treasure => (
              <View key={treasure.id} className={styles.newCard}>
                <TreasureCard
                  treasure={treasure}
                  showFavorite
                  isFavorite={favoriteTreasures.includes(treasure.id)}
                  onFavorite={toggleFavoriteTreasure}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            {hasActiveFilters ? '筛选结果' : '为你推荐'}
          </Text>
          <View className={styles.filterBtn} onClick={handleOpenFilter}>
            <Text className={styles.filterBtnText}>筛选</Text>
            <Text className={styles.filterBtnIcon}>⚙️</Text>
          </View>
        </View>

        {filteredTreasures.length > 0 ? (
          <View className={styles.treasureList}>
            {filteredTreasures.map(treasure => (
              <TreasureCard
                key={treasure.id}
                treasure={treasure}
                showFavorite
                isFavorite={favoriteTreasures.includes(treasure.id)}
                onFavorite={toggleFavoriteTreasure}
              />
            ))}
          </View>
        ) : (
          <View style={{ padding: '60rpx 0', textAlign: 'center' }}>
            <Text style={{ fontSize: '80rpx' }}>🔍</Text>
            <Text style={{ display: 'block', marginTop: '20rpx', fontSize: '28rpx', color: '#86909C' }}>
              没有找到符合条件的宝藏
            </Text>
          </View>
        )}
      </View>

      {showFilter && (
        <View className={styles.filterPanel} onClick={handleCloseFilter}>
          <View className={styles.filterContent} onClick={e => e.stopPropagation()}>
            <View className={styles.filterHeader}>
              <Text className={styles.filterTitle}>筛选</Text>
              <Text className={styles.filterReset} onClick={handleResetFilters}>重置</Text>
            </View>
            <FilterBar
              filters={tempFilters}
              onFilterChange={handleTempFilterChange}
            />
            <View className={styles.filterFooter}>
              <View className={styles.cancelBtn} onClick={handleCloseFilter}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.confirmBtn} onClick={handleConfirmFilter}>
                <Text className={styles.confirmBtnText}>确定</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default HomePage;
