import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow, useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import { useAppStore } from '@/store/useAppStore';
import { formatDistance, formatTime, buildRouteShareContent, copyToClipboard } from '@/utils';

const RouteDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || '';

  const { getRouteById, getTreasureById, favoriteRoutes, toggleFavoriteRoute } = useAppStore();
  const route = getRouteById(id);

  const [isFavorited, setIsFavorited] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    setIsFavorited(favoriteRoutes.includes(id));
  }, [id, favoriteRoutes]);

  useDidShow(() => {
    console.log('[RouteDetailPage] page showed, id:', id);
  });

  const shareContent = route ? buildRouteShareContent(route) : null;

  useShareAppMessage(() => {
    if (!shareContent) return { title: '城市散步宝藏' };
    return {
      title: shareContent.title,
      path: shareContent.path,
      imageUrl: shareContent.imageUrl
    };
  });

  useShareTimeline(() => {
    if (!shareContent) return { title: '城市散步宝藏' };
    return {
      title: shareContent.title,
      imageUrl: shareContent.imageUrl
    };
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
    setShowShare(true);
  }, []);

  const handleCloseShare = useCallback(() => {
    setShowShare(false);
  }, []);

  const handleCopyLink = useCallback(async () => {
    if (!shareContent) return;
    const link = `${shareContent.title}\n${shareContent.desc || ''}\n打开小程序查看详情`;
    const ok = await copyToClipboard(link);
    Taro.showToast({
      title: ok ? '已复制分享内容' : '复制失败',
      icon: 'none'
    });
    setShowShare(false);
  }, [shareContent]);

  const handleSaveImage = useCallback(() => {
    Taro.showToast({
      title: '海报生成中...',
      icon: 'none'
    });
    setShowShare(false);
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

      {showShare && shareContent && (
        <View className={styles.shareMask} onClick={handleCloseShare}>
          <View className={styles.sharePanel} onClick={e => e.stopPropagation()}>
            <View className={styles.shareHeader}>
              <Text className={styles.shareTitle}>分享这条路线</Text>
              <Text className={styles.shareClose} onClick={handleCloseShare}>×</Text>
            </View>
            <View className={styles.sharePreview}>
              <View className={styles.sharePreviewTop}>
                <Image className={styles.sharePreviewImg} src={shareContent.imageUrl} mode="aspectFill" />
                <View className={styles.sharePreviewInfo}>
                  <Text className={styles.sharePreviewName}>{shareContent.title}</Text>
                  <Text className={styles.sharePreviewDesc}>{shareContent.desc}</Text>
                </View>
              </View>
              <Text className={styles.sharePreviewTip}>朋友点击后可直接打开小程序查看路线详情</Text>
            </View>
            <View className={styles.shareActions}>
              <View className={styles.shareActionItem} onClick={handleCopyLink}>
                <Text className={styles.shareActionIcon}>📋</Text>
                <Text className={styles.shareActionText}>复制内容</Text>
              </View>
              <View className={styles.shareActionItem} onClick={handleSaveImage}>
                <Text className={styles.shareActionIcon}>🖼️</Text>
                <Text className={styles.shareActionText}>保存海报</Text>
              </View>
              <View className={styles.shareActionItem} onClick={handleCloseShare}>
                <Text className={styles.shareActionIcon}>💬</Text>
                <Text className={styles.shareActionText}>小程序分享</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default RouteDetailPage;
