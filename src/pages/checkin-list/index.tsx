import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store/useAppStore';
import type { CheckinRecord } from '@/types';

const CheckinListPage: React.FC = () => {
  const { checkinRecords } = useAppStore();

  useDidShow(() => {
    console.log('[CheckinListPage] page showed');
  });

  const groupedRecords = useMemo(() => {
    const groups: Record<string, CheckinRecord[]> = {};
    checkinRecords.forEach(record => {
      if (!groups[record.date]) {
        groups[record.date] = [];
      }
      groups[record.date].push(record);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [checkinRecords]);

  const handleCardClick = useCallback((treasureId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${treasureId}`
    });
  }, []);

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (checkinRecords.length === 0) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📷</Text>
          <Text className={styles.emptyText}>还没有打卡记录</Text>
          <Text className={styles.emptyDesc}>去逛逛发现宝藏，打卡记录你的足迹吧</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      {groupedRecords.map(([date, records]) => (
        <View key={date} className={styles.group}>
          <View className={styles.groupHeader}>
            <Text className={styles.groupDate}>{date}</Text>
          </View>
          {records.map(record => (
            <View
              key={record.id}
              className={styles.card}
              onClick={() => handleCardClick(record.treasureId)}
            >
              <View className={styles.cardTop}>
                <View className={styles.treasureInfo}>
                  <Text className={styles.treasureName}>{record.treasureName}</Text>
                  <Text className={styles.treasureRating}>
                    <Text className={styles.ratingStars}>{renderStars(record.rating)}</Text>
                    {record.rating}分
                  </Text>
                </View>
                <Text className={styles.arrow}>›</Text>
              </View>
              {record.comment && (
                <Text className={styles.comment}>{record.comment}</Text>
              )}
              {record.photos.length > 0 && (
                <View className={styles.photoRow}>
                  {record.photos.map((photo, idx) => (
                    <View key={idx} className={styles.photoItem}>
                      <Image className={styles.photoImg} src={photo} mode="aspectFill" />
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default CheckinListPage;
