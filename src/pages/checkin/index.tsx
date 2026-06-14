import React, { useState, useCallback } from 'react';
import { View, Text, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/useAppStore';
import dayjs from 'dayjs';

const CheckinPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || '';

  const { getTreasureById, addCheckin } = useAppStore();
  const treasure = getTreasureById(id);

  const [photos, setPhotos] = useState<string[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useDidShow(() => {
    console.log('[CheckinPage] page showed, id:', id);
  });

  const handleAddPhoto = useCallback(() => {
    Taro.chooseImage({
      count: 9 - photos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newPhotos = [...photos, ...res.tempFilePaths].slice(0, 9);
        setPhotos(newPhotos);
      },
      fail: (err) => {
        console.error('[CheckinPage] chooseImage failed:', err);
      }
    });
  }, [photos]);

  const handleDeletePhoto = useCallback((index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleRating = useCallback((value: number) => {
    setRating(value);
  }, []);

  const handleCommentChange = useCallback((e: any) => {
    const value = e.detail.value;
    if (value.length <= 140) {
      setComment(value);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!treasure) return;

    if (photos.length === 0 && comment.trim() === '') {
      Taro.showToast({
        title: '请上传照片或写点什么',
        icon: 'none'
      });
      return;
    }

    addCheckin({
      treasureId: treasure.id,
      treasureName: treasure.name,
      date: dayjs().format('YYYY-MM-DD'),
      photos: photos.length > 0 ? photos : ['https://picsum.photos/id/292/400/400'],
      comment: comment || '打卡成功！',
      rating
    });

    Taro.showToast({
      title: '打卡成功！',
      icon: 'success'
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  }, [treasure, photos, comment, rating, addCheckin]);

  const ratingLabels = ['', '很差', '一般', '还行', '推荐', '超赞'];

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
      <View className={styles.treasureInfo}>
        <Image
          className={styles.treasureImage}
          src={treasure.coverImage}
          mode="aspectFill"
        />
        <View className={styles.treasureText}>
          <Text className={styles.treasureName}>{treasure.name}</Text>
          <Text className={styles.treasureAddress}>📍 {treasure.address}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>上传照片</Text>
        <View className={styles.photoUpload}>
          {photos.map((photo, index) => (
            <View key={index} className={styles.photoItem}>
              <Image className={styles.photoImg} src={photo} mode="aspectFill" />
              <View className={styles.photoDelete} onClick={() => handleDeletePhoto(index)}>
                <Text className={styles.photoDeleteIcon}>×</Text>
              </View>
            </View>
          ))}
          {photos.length < 9 && (
            <View className={styles.photoAdd} onClick={handleAddPhoto}>
              <Text className={styles.photoAddIcon}>+</Text>
              <Text className={styles.photoAddText}>添加照片</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>给这里打个分</Text>
        <View className={styles.ratingSection}>
          <View className={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text
                key={star}
                className={classnames(styles.star, star <= rating && styles.active)}
                onClick={() => handleRating(star)}
              >
                ★
              </Text>
            ))}
          </View>
          <Text className={styles.ratingText}>{ratingLabels[rating]}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>写一句短评</Text>
        <Textarea
          className={styles.commentInput}
          placeholder="分享你的感受..."
          placeholder-class="commentPlaceholder"
          value={comment}
          onInput={handleCommentChange}
          maxlength={140}
          autoHeight
        />
        <Text className={styles.commentCount}>{comment.length}/140</Text>
      </View>

      <View
        className={classnames(styles.submitBtn, (photos.length === 0 && comment.trim() === '') && styles.submitBtnDisabled)}
        onClick={handleSubmit}
      >
        <Text className={styles.submitBtnText}>发布打卡</Text>
      </View>
    </View>
  );
};

export default CheckinPage;
