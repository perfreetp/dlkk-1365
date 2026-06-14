import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import TreasureCard from '@/components/TreasureCard';
import RouteCard from '@/components/RouteCard';
import { useAppStore } from '@/store/useAppStore';

const FavoritesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'treasures' | 'routes'>('treasures');

  const {
    treasures,
    routes,
    favoriteTreasures,
    favoriteRoutes,
    toggleFavoriteTreasure,
    toggleFavoriteRoute
  } = useAppStore();

  useDidShow(() => {
    console.log('[FavoritesPage] page showed');
  });

  const favoriteTreasureList = treasures.filter(t => favoriteTreasures.includes(t.id));
  const favoriteRouteList = routes.filter(r => favoriteRoutes.includes(r.id));

  const handlePullDownRefresh = useCallback(() => {
    console.log('[FavoritesPage] pull down refresh');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  }, []);

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.tabs}>
        <View
          className={classnames(styles.tabItem, activeTab === 'treasures' && styles.active)}
          onClick={() => setActiveTab('treasures')}
        >
          <Text className={styles.tabText}>收藏的地点</Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'routes' && styles.active)}
          onClick={() => setActiveTab('routes')}
        >
          <Text className={styles.tabText}>收藏的路线</Text>
        </View>
      </View>

      <View className={styles.content}>
        {activeTab === 'treasures' && (
          <>
            {favoriteTreasureList.length > 0 ? (
              <View className={styles.treasureList}>
                {favoriteTreasureList.map(treasure => (
                  <TreasureCard
                    key={treasure.id}
                    treasure={treasure}
                    showFavorite
                    isFavorite
                    onFavorite={toggleFavoriteTreasure}
                  />
                ))}
              </View>
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>❤️</Text>
                <Text className={styles.emptyText}>还没有收藏地点</Text>
                <Text className={styles.emptyDesc}>
                  去首页发现更多宝藏{'\n'}
                  看到喜欢的就收藏起来吧
                </Text>
              </View>
            )}
          </>
        )}

        {activeTab === 'routes' && (
          <>
            {favoriteRouteList.length > 0 ? (
              <View className={styles.routeList}>
                {favoriteRouteList.map(route => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    showFavorite
                    isFavorite
                    onFavorite={toggleFavoriteRoute}
                  />
                ))}
              </View>
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>🗺️</Text>
                <Text className={styles.emptyText}>还没有收藏路线</Text>
                <Text className={styles.emptyDesc}>
                  去路线页逛逛{'\n'}
                  收藏喜欢的步行路线
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default FavoritesPage;
