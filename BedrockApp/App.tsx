/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useRef } from 'react';
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
  AppState,
  AppStateStatus,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UUID from 'react-native-uuid';

const DEVICE_ID_KEY = 'DEVICE_ID';

const App: React.FC = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Error state
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<WebView>(null); // WebView ref
  const appState = useRef<AppStateStatus>(AppState.currentState);

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

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground! Reloading WebView...');
        if (webViewRef.current) {
          webViewRef.current.reload();
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // deviceId가 아직 로드되지 않은 경우 로딩 인디케이터 표시
  if (!deviceId) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0f0f0f" />
      </SafeAreaView>
    );
  }

  // deviceId를 쿼리 파라미터로 추가한 URL 생성
  const webViewUrl = `https://bedrock.es?deviceId=${deviceId}`;

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                if (webViewRef.current) {
                  webViewRef.current.reload();
                }
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: webViewUrl }}
            style={[
              styles.webview,
              { backgroundColor: isLoading ? 'transparent' : '#0f0f0f' },
            ]}
            userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsLinkPreview={false}
            originWhitelist={['*']}
            allowFileAccess={true} // 파일 접근 허용
            mixedContentMode="always" // HTTP와 HTTPS 혼합 컨텐츠 허용
            decelerationRate="normal"
            onShouldStartLoadWithRequest={(request) => {
              // 외부 링크를 처리
              return true;
            }}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onLoad={() => setIsLoading(false)}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('Error loading page:', nativeEvent);
              setError(nativeEvent.description); // Set error message in state
            }}
          />
        )}
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
