import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import RouteCard from '@/components/RouteCard';
import { useAppStore } from '@/store/useAppStore';

const RoutesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recommend' | 'mine'>('recommend');

  const { routes, favoriteRoutes, toggleFavoriteRoute } = useAppStore();

  useDidShow(() => {
    console.log('[RoutesPage] page showed');
  });

  const recommendRoutes = routes.filter(r => r.isRecommended);
  const myRoutes = routes.filter(r => favoriteRoutes.includes(r.id));

  const handlePullDownRefresh = useCallback(() => {
    console.log('[RoutesPage] pull down refresh');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  }, []);

  const handleCreateRoute = useCallback(() => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }, []);

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.header}>
        <Text className={styles.headerTitle}>精选路线</Text>
        <Text className={styles.headerDesc}>跟着路线走，发现城市的美好</Text>
      </View>

      <View className={styles.tabs}>
        <View
          className={classnames(styles.tabItem, activeTab === 'recommend' && styles.active)}
          onClick={() => setActiveTab('recommend')}
        >
          <Text className={styles.tabText}>推荐路线</Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'mine' && styles.active)}
          onClick={() => setActiveTab('mine')}
        >
          <Text className={styles.tabText}>我的路线</Text>
        </View>
      </View>

      {activeTab === 'recommend' && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>热门推荐</Text>
          </View>
          {recommendRoutes.length > 0 ? (
            <View className={styles.routeList}>
              {recommendRoutes.map(route => (
                <RouteCard
                  key={route.id}
                  route={route}
                  showFavorite
                  isFavorite={favoriteRoutes.includes(route.id)}
                  onFavorite={toggleFavoriteRoute}
                />
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🗺️</Text>
              <Text className={styles.emptyText}>暂无推荐路线</Text>
            </View>
          )}
        </View>
      )}

      {activeTab === 'mine' && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>我的路线</Text>
            <View className={styles.createBtn} onClick={handleCreateRoute}>
              <Text className={styles.createBtnIcon}>+</Text>
              <Text className={styles.createBtnText}>创建路线</Text>
            </View>
          </View>
          {myRoutes.length > 0 ? (
            <View className={styles.routeList}>
              {myRoutes.map(route => (
                <RouteCard
                  key={route.id}
                  route={route}
                  showFavorite
                  isFavorite={favoriteRoutes.includes(route.id)}
                  onFavorite={toggleFavoriteRoute}
                />
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📋</Text>
              <Text className={styles.emptyText}>还没有收藏路线</Text>
              <Text className={styles.emptyDesc}>去推荐路线里逛逛吧</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default RoutesPage;
