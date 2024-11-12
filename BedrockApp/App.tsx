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
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UUID from 'react-native-uuid';

const DEVICE_ID_KEY = 'DEVICE_ID';

const App: React.FC = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Error state

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
          // Error screen if there is an error
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error Loading Page</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: Platform.OS === 'android' ? 0 : 0,
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b', // Error title color
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    color: '#ffffff', // Error message color
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ff6b6b', // Retry button color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default App;