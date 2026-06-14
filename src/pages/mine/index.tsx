import React, { useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store/useAppStore';

const MinePage: React.FC = () => {
  const { favoriteTreasures, favoriteRoutes, checkinRecords } = useAppStore();

  useDidShow(() => {
    console.log('[MinePage] page showed');
  });

  const handleCheckinList = useCallback(() => {
    Taro.showToast({
      title: '打卡记录功能开发中',
      icon: 'none'
    });
  }, []);

  const handleFeedback = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/feedback/index'
    });
  }, []);

  const handleAbout = useCallback(() => {
    Taro.showToast({
      title: '城市散步宝藏 v1.0.0',
      icon: 'none'
    });
  }, []);

  const handleShare = useCallback(() => {
    Taro.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  }, []);

  const handleNewThisWeek = useCallback(() => {
    Taro.switchTab({
      url: '/pages/home/index'
    });
  }, []);

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Text className={styles.avatarIcon}>😊</Text>
          </View>
          <View className={styles.userText}>
            <Text className={styles.userName}>漫步达人</Text>
            <Text className={styles.userDesc}>已探索 12 个城市宝藏</Text>
          </View>
        </View>
        <View className={styles.stats}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{favoriteTreasures.length}</Text>
            <Text className={styles.statLabel}>收藏地点</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{favoriteRoutes.length}</Text>
            <Text className={styles.statLabel}>收藏路线</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{checkinRecords.length}</Text>
            <Text className={styles.statLabel}>打卡次数</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <Text className={styles.sectionTitle}>我的足迹</Text>
        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={handleCheckinList}>
            <Text className={styles.menuIcon}>📸</Text>
            <Text className={styles.menuText}>我的打卡</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={handleNewThisWeek}>
            <Text className={styles.menuIcon}>✨</Text>
            <Text className={styles.menuText}>本周新上榜</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={handleShare}>
            <Text className={styles.menuIcon}>🔗</Text>
            <Text className={styles.menuText}>分享给朋友</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <Text className={styles.sectionTitle}>反馈与帮助</Text>
        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={handleFeedback}>
            <Text className={styles.menuIcon}>📝</Text>
            <Text className={styles.menuText}>纠错反馈</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={handleAbout}>
            <Text className={styles.menuIcon}>ℹ️</Text>
            <Text className={styles.menuText}>关于我们</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default MinePage;
