import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import { useAppStore } from '@/store/useAppStore';
import { formatDistance, formatTime } from '@/utils';

const RouteDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || '';

  const { getRouteById, getTreasureById, favoriteRoutes, toggleFavoriteRoute } = useAppStore();
  const route = getRouteById(id);

  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setIsFavorited(favoriteRoutes.includes(id));
  }, [id, favoriteRoutes]);

  useDidShow(() => {
    console.log('[RouteDetailPage] page showed, id:', id);
  });

  const handleBack = useCallback(() => {
    Taro.navigateBack();
  }, []);

  const handleFavorite = useCallback(() => {
    toggleFavoriteRoute(id);
    Taro.showToast({
      title: isFavorited ? '已取消收藏' : '收藏成功',
      icon: 'none'
    });
  }, [id, isFavorited, toggleFavoriteRoute]);

  const handleStart = useCallback(() => {
    Taro.showToast({
      title: '开始导航功能开发中',
      icon: 'none'
    });
  }, []);

  const handleShare = useCallback(() => {
    Taro.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  }, []);

  const handleTreasureClick = useCallback((treasureId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${treasureId}`
    });
  }, []);

  if (!route) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '200rpx 0', textAlign: 'center' }}>
          <Text style={{ fontSize: '80rpx' }}>❓</Text>
          <Text style={{ display: 'block', marginTop: '20rpx', fontSize: '28rpx', color: '#86909C' }}>
            未找到该路线
          </Text>
        </View>
      </View>
    );
  }

  const treasureList = route.treasureIds
    .map(tid => getTreasureById(tid))
    .filter(Boolean);

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text className={styles.backIcon}>‹</Text>
        </View>
      </View>

      <View className={styles.banner}>
        <Image
          className={styles.bannerImage}
          src={route.coverImage}
          mode="aspectFill"
        />
        <View className={styles.bannerOverlay} />
      </View>

      <ScrollView scrollY>
        <View className={styles.content}>
          <View className={styles.titleSection}>
            <Text className={styles.title}>{route.name}</Text>
            <View className={styles.tagRow}>
              {route.tags.map((tag, index) => (
                <Tag key={index} text={tag} type="primary" size="small" />
              ))}
            </View>
            <Text className={styles.desc}>{route.description}</Text>
          </View>

          <View className={styles.statsCard}>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{route.treasureIds.length}</Text>
              <Text className={styles.statLabel}>个宝藏点</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{formatDistance(route.totalDistance)}</Text>
              <Text className={styles.statLabel}>总距离</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{formatTime(route.totalTime)}</Text>
              <Text className={styles.statLabel}>步行时间</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{formatTime(route.totalStayTime)}</Text>
              <Text className={styles.statLabel}>停留时间</Text>
            </View>
          </View>

          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📍</Text>
            路线详情
          </Text>
          <View className={styles.timeline}>
            {treasureList.map((treasure, index) => (
              <View
                key={treasure!.id}
                className={styles.timelineItem}
                onClick={() => handleTreasureClick(treasure!.id)}
              >
                <View className={styles.timelineDot}>
                  <Text className={styles.timelineDotIcon}>{index + 1}</Text>
                </View>
                <View className={styles.timelineLine} />
                <View className={styles.timelineContent}>
                  <Text className={styles.treasureName}>{treasure!.name}</Text>
                  <Text className={styles.treasureInfo}>
                    {formatDistance(treasure!.distance)} · 步行约{treasure!.walkTime}分钟
                  </Text>
                  <Text className={styles.treasureStay}>
                    建议停留 {formatTime(treasure!.stayTime)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.favoriteBtn, isFavorited && styles.favorited)}
          onClick={handleFavorite}
        >
          <Text className={styles.favoriteIcon}>{isFavorited ? '♥' : '♡'}</Text>
          <Text className={styles.favoriteText}>收藏</Text>
        </View>
        <View className={styles.shareBtn} onClick={handleShare}>
          <Text className={styles.shareIcon}>📤</Text>
          <Text className={styles.shareText}>分享</Text>
        </View>
        <View className={styles.startBtn} onClick={handleStart}>
          <Text className={styles.startBtnText}>开始走这条路线</Text>
        </View>
      </View>
    </View>
  );
};

export default RouteDetailPage;
