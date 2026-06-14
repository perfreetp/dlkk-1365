import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import Tag from '../Tag';
import type { Treasure } from '@/types';
import { formatDistance, getCategoryLabel, getCategoryColor } from '@/utils';

interface TreasureCardProps {
  treasure: Treasure;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
  className?: string;
}

const TreasureCard: React.FC<TreasureCardProps> = ({
  treasure,
  showFavorite = false,
  isFavorite = false,
  onFavorite,
  className
}) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${treasure.id}`
    });
  };

  const handleFavoriteClick = (e: any) => {
    e.stopPropagation();
    onFavorite?.(treasure.id);
  };

  return (
    <View className={classnames(styles.card, className)} onClick={handleClick}>
      <View className={styles.imageWrap}>
        <Image
          className={styles.image}
          src={treasure.coverImage}
          mode="aspectFill"
        />
        {treasure.isNew && (
          <View className={styles.newBadge}>
            <Text className={styles.newBadgeText}>NEW</Text>
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
        <View
          className={styles.categoryTag}
          style={{ backgroundColor: getCategoryColor(treasure.category) }}
        >
          <Text className={styles.categoryText}>{getCategoryLabel(treasure.category)}</Text>
        </View>
      </View>
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{treasure.name}</Text>
          <View className={styles.rating}>
            <Text className={styles.ratingStar}>★</Text>
            <Text className={styles.ratingText}>{treasure.rating}</Text>
          </View>
        </View>
        <Text className={styles.address}>📍 {treasure.address}</Text>
        <View className={styles.footer}>
          <View className={styles.info}>
            <Text className={styles.infoText}>🚶 {treasure.walkTime}分钟</Text>
            <Text className={styles.infoText}>·</Text>
            <Text className={styles.infoText}>{formatDistance(treasure.distance)}</Text>
          </View>
          <Text className={styles.budget}>{treasure.budgetDesc}</Text>
        </View>
        <View className={styles.tagRow}>
          {treasure.isRainy && <Tag text="雨天可去" type="rain" size="small" />}
          {treasure.isKidFriendly && <Tag text="亲子友好" type="kid" size="small" />}
          {treasure.budget === 'free' && <Tag text="免费" type="free" size="small" />}
        </View>
      </View>
    </View>
  );
};

export default TreasureCard;
