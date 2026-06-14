import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import './app.scss';

function App(props) {
  const hydrateFromStorage = useAppStore(state => state.hydrateFromStorage);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useDidShow(() => {
    hydrateFromStorage();
  });

  useDidHide(() => {});

  return props.children;
}

export default App;
