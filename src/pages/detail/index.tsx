import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import { useAppStore } from '@/store/useAppStore';
import { getCategoryLabel, getCategoryColor, formatDistance, formatBudget } from '@/utils';

const DetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || '';

  const { getTreasureById, favoriteTreasures, toggleFavoriteTreasure } = useAppStore();
  const treasure = getTreasureById(id);

  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setIsFavorited(favoriteTreasures.includes(id));
  }, [id, favoriteTreasures]);

  useDidShow(() => {
    console.log('[DetailPage] page showed, id:', id);
  });

  const handleBack = useCallback(() => {
    Taro.navigateBack();
  }, []);

  const handleFavorite = useCallback(() => {
    toggleFavoriteTreasure(id);
    Taro.showToast({
      title: isFavorited ? '已取消收藏' : '收藏成功',
      icon: 'none'
    });
  }, [id, isFavorited, toggleFavoriteTreasure]);

  const handleCheckin = useCallback(() => {
    Taro.navigateTo({
      url: `/pages/checkin/index?id=${id}`
    });
  }, [id]);

  const handleShare = useCallback(() => {
    Taro.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  }, []);

  if (!treasure) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '200rpx 0', textAlign: 'center' }}>
          <Text style={{ fontSize: '80rpx' }}>❓</Text>
          <Text style={{ display: 'block', marginTop: '20rpx', fontSize: '28rpx', color: '#86909C' }}>
            未找到该宝藏
          </Text>
        </View>
      </View>
    );
  }

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
          src={treasure.coverImage}
          mode="aspectFill"
        />
        <View className={styles.bannerOverlay} />
      </View>

      <ScrollView scrollY>
        <View className={styles.content}>
          <View className={styles.titleSection}>
            <Text className={styles.title}>{treasure.name}</Text>
            <View className={styles.tagRow}>
              <Tag text={getCategoryLabel(treasure.category)} type="primary" size="medium" />
              {treasure.isRainy && <Tag text="雨天可去" type="rain" size="medium" />}
              {treasure.isKidFriendly && <Tag text="亲子友好" type="kid" size="medium" />}
              {treasure.budget === 'free' && <Tag text="免费" type="free" size="medium" />}
            </View>
          </View>

          <View className={styles.infoCard}>
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>📍</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>地址</Text>
                <Text className={styles.infoText}>{treasure.address}</Text>
              </View>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>🚶</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>距离与步行时间</Text>
                <Text className={styles.infoText}>
                  {formatDistance(treasure.distance)} · 步行约{treasure.walkTime}分钟
                </Text>
              </View>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>💰</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>预算</Text>
                <Text className={styles.infoText}>{treasure.budgetDesc}</Text>
              </View>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>⏰</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>开放时间</Text>
                <Text className={styles.infoText}>{treasure.openTime}</Text>
              </View>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>⭐</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>评分</Text>
                <Text className={styles.infoText}>
                  {treasure.rating} 分 · {treasure.reviewCount} 条评价
                </Text>
              </View>
            </View>
          </View>

          <View className={styles.infoCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>✨</Text>
              亮点特色
            </Text>
            <View className={styles.highlightList}>
              {treasure.highlights.map((highlight, index) => (
                <View key={index} className={styles.highlightItem}>
                  <Text className={styles.highlightIcon}>•</Text>
                  <Text className={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.infoCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>⚠️</Text>
              避坑提示
            </Text>
            <View className={styles.tipList}>
              {treasure.tips.map((tip, index) => (
                <View key={index} className={styles.tipItem}>
                  <Text className={styles.tipIcon}>💡</Text>
                  <Text className={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.infoCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📸</Text>
              适合拍照的位置
            </Text>
            <View className={styles.photoSpotList}>
              {treasure.photoSpots.map((spot, index) => (
                <View key={index} className={styles.photoSpotItem}>
                  <Text className={styles.photoSpotIcon}>📷</Text>
                  <Text className={styles.photoSpotText}>{spot}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.infoCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🏪</Text>
              附近补给
            </Text>
            <View className={styles.supplyList}>
              {treasure.nearbySupplies.map((supply, index) => (
                <View key={index} className={styles.supplyItem}>
                  <Text className={styles.supplyIcon}>📍</Text>
                  <Text className={styles.supplyText}>{supply}</Text>
                </View>
              ))}
            </View>
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
          <Text className={styles.shareBtnText}>分享给朋友</Text>
        </View>
        <View className={styles.checkinBtn} onClick={handleCheckin}>
          <Text className={styles.checkinBtnText}>立即打卡</Text>
        </View>
      </View>
    </View>
  );
};

export default DetailPage;
