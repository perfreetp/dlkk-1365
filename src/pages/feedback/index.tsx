import React, { useState, useCallback } from 'react';
import { View, Text, Textarea, Input, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

const FeedbackPage: React.FC = () => {
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const feedbackTypes = [
    { value: 'wrong_info', label: '信息有误' },
    { value: 'closed', label: '已停业' },
    { value: 'wrong_location', label: '位置不对' },
    { value: 'bad_experience', label: '体验不好' },
    { value: 'suggestion', label: '功能建议' },
    { value: 'other', label: '其他问题' }
  ];

  useDidShow(() => {
    console.log('[FeedbackPage] page showed');
  });

  const handleTypeClick = useCallback((value: string) => {
    setType(value);
  }, []);

  const handleContentChange = useCallback((e: any) => {
    const value = e.detail.value;
    if (value.length <= 500) {
      setContent(value);
    }
  }, []);

  const handleContactChange = useCallback((e: any) => {
    setContact(e.detail.value);
  }, []);

  const handleAddPhoto = useCallback(() => {
    Taro.chooseImage({
      count: 3 - photos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newPhotos = [...photos, ...res.tempFilePaths].slice(0, 3);
        setPhotos(newPhotos);
      },
      fail: (err) => {
        console.error('[FeedbackPage] chooseImage failed:', err);
      }
    });
  }, [photos]);

  const handleDeletePhoto = useCallback((index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!type) {
      Taro.showToast({
        title: '请选择反馈类型',
        icon: 'none'
      });
      return;
    }

    if (!content.trim()) {
      Taro.showToast({
        title: '请描述问题',
        icon: 'none'
      });
      return;
    }

    console.log('[FeedbackPage] submit feedback:', { type, content, contact, photos });

    Taro.showToast({
      title: '反馈已提交，感谢！',
      icon: 'success'
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  }, [type, content, contact, photos]);

  return (
    <View className={styles.page}>
      <Text className={styles.desc}>
        发现宝藏信息有误？有任何建议都欢迎告诉我们，我们会尽快处理！
      </Text>

      <View className={styles.formCard}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>反馈类型</Text>
          <View className={styles.typeOptions}>
            {feedbackTypes.map((item) => (
              <View
                key={item.value}
                className={classnames(styles.typeOption, type === item.value && styles.active)}
                onClick={() => handleTypeClick(item.value)}
              >
                <Text className={styles.typeOptionText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>问题描述</Text>
          <Textarea
            className={styles.textarea}
            placeholder="请详细描述你遇到的问题或建议..."
            placeholder-class="textareaPlaceholder"
            value={content}
            onInput={handleContentChange}
            maxlength={500}
            autoHeight
          />
          <Text className={styles.wordCount}>{content.length}/500</Text>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>上传图片（可选，最多3张）</Text>
          <View className={styles.photoUpload}>
            {photos.map((photo, index) => (
              <View key={index} className={styles.photoItem}>
                <Image className={styles.photoImg} src={photo} mode="aspectFill" />
                <View className={styles.photoDelete} onClick={() => handleDeletePhoto(index)}>
                  <Text className={styles.photoDeleteIcon}>×</Text>
                </View>
              </View>
            ))}
            {photos.length < 3 && (
              <View className={styles.photoAdd} onClick={handleAddPhoto}>
                <Text className={styles.photoAddIcon}>+</Text>
                <Text className={styles.photoAddText}>添加图片</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>联系方式（选填）</Text>
          <Input
            className={styles.contactInput}
            placeholder="手机号或微信，方便我们联系你"
            placeholder-class="inputPlaceholder"
            value={contact}
            onInput={handleContactChange}
          />
        </View>
      </View>

      <View className={styles.submitBtn} onClick={handleSubmit}>
        <Text className={styles.submitBtnText}>提交反馈</Text>
      </View>
    </View>
  );
};

export default FeedbackPage;
