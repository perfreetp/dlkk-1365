import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import TreasureCard from '@/components/TreasureCard';
import FilterBar from '@/components/FilterBar';
import { useAppStore } from '@/store/useAppStore';
import type { FilterOptions } from '@/types';

const ExplorePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showFilter, setShowFilter] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>({
    walkDuration: '',
    budget: '',
    isRainy: false,
    isKidFriendly: false,
    category: ''
  });

  const {
    filters,
    favoriteTreasures,
    setFilters,
    toggleFavoriteTreasure,
    getFilteredTreasures
  } = useAppStore();

  const filteredTreasures = useMemo(() => getFilteredTreasures(), [filters, getFilteredTreasures]);

  useDidShow(() => {
    console.log('[ExplorePage] page showed');
  });

  const handleSearch = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/search/index'
    });
  }, []);

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
    console.log('[ExplorePage] pull down refresh');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  }, []);

  const hasActiveFilters = filters.category || filters.walkDuration || filters.budget || filters.isRainy || filters.isKidFriendly;

  const mapMarkers = useMemo(() => {
    return filteredTreasures.slice(0, 8).map((t, i) => ({
      ...t,
      left: 15 + (i % 4) * 22 + Math.random() * 10,
      top: 20 + Math.floor(i / 4) * 35 + Math.random() * 15
    }));
  }, [filteredTreasures]);

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.header}>
        <View className={styles.searchBar} onClick={handleSearch}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchText}>搜索宝藏地点...</Text>
        </View>
        <View className={styles.viewToggle}>
          <View
            className={classnames(styles.toggleBtn, viewMode === 'map' && styles.active)}
            onClick={() => setViewMode('map')}
          >
            <Text className={styles.toggleText}>地图模式</Text>
          </View>
          <View
            className={classnames(styles.toggleBtn, viewMode === 'list' && styles.active)}
            onClick={() => setViewMode('list')}
          >
            <Text className={styles.toggleText}>列表模式</Text>
          </View>
        </View>
      </View>

      {viewMode === 'map' && (
        <View className={styles.mapView}>
          <Text className={styles.mapTitle}>📍 附近宝藏点</Text>
          {mapMarkers.map((marker) => (
            <View
              key={marker.id}
              className={styles.mapMarker}
              style={{ left: `${marker.left}%`, top: `${marker.top}%` }}
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/detail/index?id=${marker.id}`
                });
              }}
            >
              <Text className={styles.markerPin}>📍</Text>
              <Text className={styles.markerLabel}>{marker.name}</Text>
            </View>
          ))}
        </View>
      )}

      <View className={styles.listView}>
        <View className={styles.filterSummary}>
          <Text className={styles.filterSummaryText}>
            共 {filteredTreasures.length} 个宝藏
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
          <View style={{ padding: '80rpx 0', textAlign: 'center' }}>
            <Text style={{ fontSize: '100rpx' }}>🔍</Text>
            <Text style={{ display: 'block', marginTop: '24rpx', fontSize: '30rpx', color: '#86909C' }}>
              没有找到符合条件的宝藏
            </Text>
            <Text style={{ display: 'block', marginTop: '12rpx', fontSize: '26rpx', color: '#C9CDD4' }}>
              试试调整筛选条件吧
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

export default ExplorePage;
