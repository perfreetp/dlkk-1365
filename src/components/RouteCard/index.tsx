import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { Route } from '@/types';
import { formatDistance, formatTime } from '@/utils';

interface RouteCardProps {
  route: Route;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
  className?: string;
}

const RouteCard: React.FC<RouteCardProps> = ({
  route,
  showFavorite = false,
  isFavorite = false,
  onFavorite,
  className
}) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/route-detail/index?id=${route.id}`
    });
  };

  const handleFavoriteClick = (e: any) => {
    e.stopPropagation();
    onFavorite?.(route.id);
  };

  const difficultyText: Record<string, string> = {
    easy: '轻松',
    medium: '适中',
    hard: '有挑战'
  };

  return (
    <View className={classnames(styles.card, className)} onClick={handleClick}>
      <View className={styles.imageWrap}>
        <Image
          className={styles.image}
          src={route.coverImage}
          mode="aspectFill"
        />
        {route.isRecommended && (
          <View className={styles.recommendBadge}>
            <Text className={styles.recommendText}>推荐路线</Text>
          </View>
        )}
        {showFavorite && (
          <View
            className={classnames(styles.favoriteBtn, isFavorite && styles.favorited)}
            onClick={handleFavoriteClick}
          >
            <Text className={styles.favoriteIcon}>{isFavorite ? '♥' : '♡'}</Text>
          </View>
        )}
      </View>
      <View className={styles.content}>
        <Text className={styles.name}>{route.name}</Text>
        <Text className={styles.desc}>{route.description}</Text>
        <View className={styles.stats}>
          <View className={styles.statItem}>
            <Text className={styles.statIcon}>📍</Text>
            <Text className={styles.statText}>{route.treasureIds.length}个点</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statIcon}>🚶</Text>
            <Text className={styles.statText}>{formatDistance(route.totalDistance)}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statIcon}>⏱</Text>
            <Text className={styles.statText}>{formatTime(route.totalTime + route.totalStayTime)}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statIcon}>💪</Text>
            <Text className={styles.statText}>{difficultyText[route.difficulty]}</Text>
          </View>
        </View>
        <View className={styles.tagRow}>
          {route.tags.map((tag, index) => (
            <View key={index} className={styles.tag}>
              <Text className={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default RouteCard;
