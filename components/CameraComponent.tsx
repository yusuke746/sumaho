import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

export default function CameraComponent() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  if (Platform.OS === 'web') {
    return <View><Text>Webではカメラ機能は利用できません。</Text></View>;
  }
  if (hasPermission === null) {
    return <View><Text>カメラ権限を確認中...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>カメラ権限がありません</Text></View>;
  }
  if (device == null) {
    return <View><Text>カメラデバイスを検出中...</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      {showCamera ? (
        <Camera
          style={{ flex: 1 }}
          device={device}
          isActive={true}
        />
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: '#2196F3',
            padding: 16,
            borderRadius: 8,
            alignSelf: 'center',
            marginTop: 40,
          }}
          onPress={() => setShowCamera(true)}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>読み取り</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
