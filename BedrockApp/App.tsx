/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UUID from 'react-native-uuid';

const DEVICE_ID_KEY = 'DEVICE_ID';

const App: React.FC = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const getDeviceId = async () => {
      try {
        // AsyncStorage에서 deviceId 가져오기
        let storedDeviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
        console.log('Stored Device ID:', storedDeviceId);

        if (!storedDeviceId) {
          // 새 UUID 생성
          const newUuid = UUID.v4().toString();
          console.log('Generated New UUID:', newUuid);

          // AsyncStorage에 저장
          await AsyncStorage.setItem(DEVICE_ID_KEY, newUuid);
          storedDeviceId = newUuid;
        }

        setDeviceId(storedDeviceId);
      } catch (error) {
        console.error('Error retrieving or generating deviceId:', error);
        Alert.alert('Error', 'Failed to load device ID.');
      }
    };

    getDeviceId();
  }, []);

  // deviceId가 아직 로드되지 않은 경우 로딩 인디케이터 표시
  if (!deviceId) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  // deviceId를 쿼리 파라미터로 추가한 URL 생성
  const webViewUrl = `https://bedrock.es?deviceId=${deviceId}`;

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content" // 텍스트 색상을 밝은 색으로 설정
          backgroundColor="#0f0f0f" // 상태 표시줄 배경을 검은색으로 설정
        />
        <WebView
          source={{ uri: webViewUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        // 선택 사항: 네비게이션 상태 변경 핸들링
        // onNavigationStateChange={(navState) => { /* 상태 변경 처리 */ }}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f', // 최상위 View의 배경색 설정
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 0 : StatusBar.currentHeight,
    backgroundColor: '#0f0f0f', // 배경색을 검은색으로 설정
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f', // 배경색을 검은색으로 설정
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;