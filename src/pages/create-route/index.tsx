import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Input, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/useAppStore';
import type { Treasure } from '@/types';
import { formatDistance, formatTime } from '@/utils';

const CreateRoutePage: React.FC = () => {
  const { treasures, addCustomRoute } = useAppStore();

  const [routeName, setRouteName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useDidShow(() => {
    console.log('[CreateRoutePage] page showed');
  });

  const selectedTreasures = useMemo(() => {
    return selectedIds
      .map(id => treasures.find(t => t.id === id))
      .filter((t): t is Treasure => t !== undefined);
  }, [selectedIds, treasures]);

  const stats = useMemo(() => {
    if (selectedTreasures.length === 0) {
      return { totalDistance: 0, totalWalkTime: 0, totalStayTime: 0 };
    }
    const totalDistance = selectedTreasures.reduce((sum, t) => sum + t.distance, 0);
    const totalWalkTime = selectedTreasures.reduce((sum, t) => sum + t.walkTime, 0);
    const totalStayTime = selectedTreasures.reduce((sum, t) => sum + t.stayTime, 0);
    return { totalDistance, totalWalkTime, totalStayTime };
  }, [selectedTreasures]);

  const handleNameChange = useCallback((e: any) => {
    setRouteName(e.detail.value);
  }, []);

  const toggleTreasure = useCallback((id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(tid => tid !== id);
      }
      return [...prev, id];
    });
  }, []);

  const moveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setSelectedIds(prev => {
      const newIds = [...prev];
      [newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]];
      return newIds;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setSelectedIds(prev => {
      if (index >= prev.length - 1) return prev;
      const newIds = [...prev];
      [newIds[index + 1], newIds[index]] = [newIds[index], newIds[index + 1]];
      return newIds;
    });
  }, []);

  const removeTreasure = useCallback((index: number) => {
    setSelectedIds(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleCancel = useCallback(() => {
    Taro.navigateBack();
  }, []);

  const handleSave = useCallback(() => {
    if (selectedTreasures.length < 2) {
      Taro.showToast({
        title: '至少选择2个地点',
        icon: 'none'
      });
      return;
    }

    const finalName = routeName.trim() || `我的路线 ${selectedTreasures.length} 站`;

    addCustomRoute({
      name: finalName,
      coverImage: selectedTreasures[0]?.coverImage || 'https://picsum.photos/id/1015/800/400',
      description: `包含 ${selectedTreasures.length} 个精选地点，总步行约 ${formatTime(stats.totalWalkTime)}`,
      treasureIds: selectedIds,
      totalDistance: stats.totalDistance,
      totalTime: stats.totalWalkTime,
      totalStayTime: stats.totalStayTime,
      difficulty: stats.totalWalkTime < 40 ? 'easy' : stats.totalWalkTime < 80 ? 'medium' : 'hard',
      isRecommended: false,
      tags: ['自定义']
    });

    Taro.showToast({
      title: '路线已保存',
      icon: 'success'
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  }, [selectedTreasures, selectedIds, routeName, stats, addCustomRoute]);

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>创建专属路线</Text>
        <Text className={styles.desc}>勾选喜欢的地点，组合成你的半日漫步</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>路线名称</Text>
        <Input
          className={styles.nameInput}
          placeholder="给这条路线起个名字吧"
          placeholder-class="inputPlaceholder"
          value={routeName}
          onInput={handleNameChange}
          maxlength={20}
        />
      </View>

      {selectedTreasures.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>路线顺序（{selectedTreasures.length} 站）</Text>
          <View className={styles.selectedList}>
            {selectedTreasures.map((treasure, index) => (
              <View key={treasure.id} className={styles.selectedItem}>
                <Text className={styles.orderNum}>{index + 1}</Text>
                <Image className={styles.selectedImage} src={treasure.coverImage} mode="aspectFill" />
                <View className={styles.selectedInfo}>
                  <Text className={styles.selectedName}>{treasure.name}</Text>
                  <Text className={styles.selectedMeta}>
                    步行{treasure.walkTime}分钟 · 停留{formatTime(treasure.stayTime)}
                  </Text>
                </View>
                <View className={styles.itemActions}>
                  <View
                    className={classnames(styles.actionBtn)}
                    onClick={() => moveUp(index)}
                  >
                    <Text>↑</Text>
                  </View>
                  <View
                    className={styles.actionBtn}
                    onClick={() => moveDown(index)}
                  >
                    <Text>↓</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.delete)}
                    onClick={() => removeTreasure(index)}
                  >
                    <Text>×</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {selectedTreasures.length > 0 && (
        <View className={styles.section}>
          <View className={styles.statsCard}>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{formatDistance(stats.totalDistance)}</Text>
              <Text className={styles.statLabel}>总距离</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{formatTime(stats.totalWalkTime)}</Text>
              <Text className={styles.statLabel}>步行时间</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{formatTime(stats.totalStayTime)}</Text>
              <Text className={styles.statLabel}>建议停留</Text>
            </View>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>选择地点</Text>
        {treasures.length > 0 ? (
          <View className={styles.treasureList}>
            {treasures.map(treasure => {
              const isChecked = selectedIds.includes(treasure.id);
              return (
                <View
                  key={treasure.id}
                  className={styles.treasureItem}
                  onClick={() => toggleTreasure(treasure.id)}
                >
                  <View className={classnames(styles.checkbox, isChecked && styles.checked)}>
                    {isChecked && <Text className={styles.checkIcon}>✓</Text>}
                  </View>
                  <Image className={styles.treasureImage} src={treasure.coverImage} mode="aspectFill" />
                  <View className={styles.treasureInfo}>
                    <Text className={styles.treasureName}>{treasure.name}</Text>
                    <Text className={styles.treasureAddr}>📍 {treasure.address}</Text>
                    <View className={styles.treasureMeta}>
                      <Text className={styles.metaText}>🚶 {treasure.walkTime}分钟</Text>
                      <Text className={styles.metaText}>·</Text>
                      <Text className={styles.metaText}>{formatDistance(treasure.distance)}</Text>
                      <Text className={styles.metaText}>·</Text>
                      <Text className={styles.metaText}>{treasure.budgetDesc}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className={styles.emptyHint}>
            <Text className={styles.emptyIcon}>🏷️</Text>
            <Text className={styles.emptyText}>暂无可选地点</Text>
          </View>
        )}
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.summaryText}>
          已选 <Text className={styles.summaryHighlight}>{selectedIds.length}</Text> 个地点
        </View>
        <View className={styles.cancelBtn} onClick={handleCancel}>
          <Text className={styles.cancelBtnText}>取消</Text>
        </View>
        <View
          className={classnames(styles.saveBtn, selectedIds.length < 2 && styles.disabled)}
          onClick={handleSave}
        >
          <Text className={styles.saveBtnText}>保存路线</Text>
        </View>
      </View>
    </View>
  );
};

export default CreateRoutePage;
