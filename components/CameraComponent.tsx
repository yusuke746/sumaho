import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Button } from 'react-native';
import Camera from 'expo-camera';

export default function CameraComponent() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // CameraTypeは文字列型
  const [type, setType] = useState<'front' | 'back'>('back');
  const cameraRef = useRef<Camera | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleRead = async () => {
    if (cameraRef.current) {
      setLoading(true);
      setResult(null);
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4-vision-preview',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: 'この画像から情報を抽出し、JSON形式で出力してください。' },
                  { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${photo.base64}` } }
                ]
              }
            ],
            max_tokens: 300,
          }),
        });
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } catch (e) {
        setResult('APIエラー: ' + String(e));
      }
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <View><Text>カメラ権限を確認中...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>カメラ権限がありません</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef} />
      <TouchableOpacity
        style={styles.button}
        onPress={handleRead}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? '読み取り中...' : '読み取り'}</Text>
      </TouchableOpacity>
      <Button title="切り替え" onPress={() => setType(
        type === 'back' ? 'front' : 'back'
      )} />
      <View style={styles.resultContainer}>
        {loading && <ActivityIndicator size="large" color="#2196F3" />}
        {result && (
          <ScrollView>
            <Text style={styles.resultText}>{result}</Text>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    zIndex: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  resultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: 100,
    backgroundColor: '#fff',
    padding: 8,
    zIndex: 1,
  },
  resultText: {
    fontSize: 12,
    color: '#333',
  },
});
