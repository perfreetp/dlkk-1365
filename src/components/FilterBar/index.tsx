import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { FilterOptions, TreasureCategory, WalkDuration, BudgetLevel } from '@/types';
import { getCategoryLabel, getWalkDurationLabel, formatBudget } from '@/utils';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, className }) => {
  const categories: (TreasureCategory | '')[] = ['', 'food', 'shop', 'exhibition', 'park', 'viewpoint', 'cafe'];
  const walkDurations: (WalkDuration | '')[] = ['', '15min', '30min', '45min', '60min'];
  const budgets: (BudgetLevel | '')[] = ['', 'free', 'low', 'medium', 'high'];

  const toggleRainy = () => {
    onFilterChange({ isRainy: !filters.isRainy });
  };

  const toggleKidFriendly = () => {
    onFilterChange({ isKidFriendly: !filters.isKidFriendly });
  };

  return (
    <View className={classnames(styles.filterBar, className)}>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>分类</Text>
        <ScrollView scrollX className={styles.scrollRow} enhanced showScrollbar={false}>
          <View className={styles.filterRow}>
            {categories.map((cat) => (
              <View
                key={cat || 'all'}
                className={classnames(styles.filterItem, filters.category === cat && styles.active)}
                onClick={() => onFilterChange({ category: cat })}
              >
                <Text className={styles.filterText}>{cat ? getCategoryLabel(cat) : '全部'}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>步行时长</Text>
        <ScrollView scrollX className={styles.scrollRow} enhanced showScrollbar={false}>
          <View className={styles.filterRow}>
            {walkDurations.map((d) => (
              <View
                key={d || 'all'}
                className={classnames(styles.filterItem, filters.walkDuration === d && styles.active)}
                onClick={() => onFilterChange({ walkDuration: d })}
              >
                <Text className={styles.filterText}>{d ? getWalkDurationLabel(d) : '不限'}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>预算</Text>
        <ScrollView scrollX className={styles.scrollRow} enhanced showScrollbar={false}>
          <View className={styles.filterRow}>
            {budgets.map((b) => (
              <View
                key={b || 'all'}
                className={classnames(styles.filterItem, filters.budget === b && styles.active)}
                onClick={() => onFilterChange({ budget: b })}
              >
                <Text className={styles.filterText}>{b ? formatBudget(b) : '不限'}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>特色</Text>
        <View className={styles.toggleRow}>
          <View
            className={classnames(styles.toggleItem, filters.isRainy && styles.toggleActive)}
            onClick={toggleRainy}
          >
            <Text className={styles.toggleIcon}>🌧️</Text>
            <Text className={styles.toggleText}>雨天可去</Text>
          </View>
          <View
            className={classnames(styles.toggleItem, filters.isKidFriendly && styles.toggleActive)}
            onClick={toggleKidFriendly}
          >
            <Text className={styles.toggleIcon}>👶</Text>
            <Text className={styles.toggleText}>亲子友好</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FilterBar;
