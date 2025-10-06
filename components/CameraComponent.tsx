import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Camera from 'expo-camera';

export default function CameraComponent() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View><Text>カメラ権限を確認中...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>カメラ権限がありません</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      {showCamera ? (
        <Camera style={{ flex: 1 }} />
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
