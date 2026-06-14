import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import TreasureCard from '@/components/TreasureCard';
import { useAppStore } from '@/store/useAppStore';

const SearchPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(['糖水铺', '公园', '咖啡馆']);
  const [hasSearched, setHasSearched] = useState(false);

  const { treasures, favoriteTreasures, toggleFavoriteTreasure } = useAppStore();

  const hotKeywords = ['老街糖水铺', '口袋公园', '独立书店', '观景台', '猫咪咖啡馆', '艺术展'];

  useDidShow(() => {
    console.log('[SearchPage] page showed');
  });

  const searchResults = useMemo(() => {
    if (!keyword.trim()) return [];
    const lowerKeyword = keyword.toLowerCase();
    return treasures.filter(t =>
      t.name.toLowerCase().includes(lowerKeyword) ||
      t.address.toLowerCase().includes(lowerKeyword) ||
      t.highlights.some(h => h.toLowerCase().includes(lowerKeyword))
    );
  }, [keyword, treasures]);

  const handleBack = useCallback(() => {
    Taro.navigateBack();
  }, []);

  const handleInputChange = useCallback((e: any) => {
    setKeyword(e.detail.value);
  }, []);

  const handleSearch = useCallback(() => {
    if (!keyword.trim()) return;
    setHasSearched(true);
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== keyword);
      return [keyword, ...filtered].slice(0, 10);
    });
  }, [keyword]);

  const handleHotTagClick = useCallback((tag: string) => {
    setKeyword(tag);
    setHasSearched(true);
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== tag);
      return [tag, ...filtered].slice(0, 10);
    });
  }, []);

  const handleHistoryClick = useCallback((history: string) => {
    setKeyword(history);
    setHasSearched(true);
  }, []);

  const handleDeleteHistory = useCallback((history: string, e: any) => {
    e.stopPropagation();
    setSearchHistory(prev => prev.filter(h => h !== history));
  }, []);

  const handleClearHistory = useCallback(() => {
    Taro.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          setSearchHistory([]);
        }
      }
    });
  }, []);

  const handleCancel = useCallback(() => {
    Taro.navigateBack();
  }, []);

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text className={styles.backIcon}>‹</Text>
        </View>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索宝藏地点..."
            value={keyword}
            onInput={handleInputChange}
            onConfirm={handleSearch}
            confirmType="search"
            autofocus
          />
        </View>
        <Text className={styles.cancelBtn} onClick={handleCancel}>取消</Text>
      </View>

      <View className={styles.content}>
        {!hasSearched && keyword.trim() === '' && (
          <>
            <View className={styles.section}>
              <Text className={styles.sectionTitle}>热门搜索</Text>
              <View className={styles.hotTags}>
                {hotKeywords.map((tag, index) => (
                  <View key={index} className={styles.hotTag} onClick={() => handleHotTagClick(tag)}>
                    <Text className={styles.hotTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            {searchHistory.length > 0 && (
              <View className={styles.section}>
                <View className={styles.historyHeader}>
                  <Text className={styles.sectionTitle}>搜索历史</Text>
                  <Text className={styles.clearBtn} onClick={handleClearHistory}>清空</Text>
                </View>
                <View className={styles.historyList}>
                  {searchHistory.map((history, index) => (
                    <View key={index} className={styles.historyItem} onClick={() => handleHistoryClick(history)}>
                      <Text className={styles.historyIcon}>🕐</Text>
                      <Text className={styles.historyText}>{history}</Text>
                      <Text className={styles.historyDelete} onClick={(e) => handleDeleteHistory(history, e)}>×</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {(hasSearched || keyword.trim() !== '') && (
          <>
            {searchResults.length > 0 ? (
              <View className={styles.resultList}>
                {searchResults.map(treasure => (
                  <TreasureCard
                    key={treasure.id}
                    treasure={treasure}
                    showFavorite
                    isFavorite={favoriteTreasures.includes(treasure.id)}
                    onFavorite={toggleFavoriteTreasure}
                  />
                ))}
              </View>
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>🔍</Text>
                <Text className={styles.emptyText}>没有找到相关结果</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default SearchPage;
