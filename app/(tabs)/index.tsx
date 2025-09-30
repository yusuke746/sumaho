import { Camera } from 'expo-camera';
import { ActivityIndicator, Button, StyleSheet, View, Image } from 'react-native';
import { useState, useRef } from 'react';
import { Platform } from 'react-native';


import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

function CameraComponent() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const cameraRef = useRef<Camera>(null);

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync();
      setImage(photo.uri);
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    requestPermission();
    return <View />;
  }
  if (hasPermission === false) {
    return <View><Button title="Grant Camera Permission" onPress={requestPermission} /></View>;
  }

  return (
    <View style={styles.cameraContainer}>
      {!image ? (
        <>
          <Camera style={styles.camera} ref={cameraRef}>
            <View style={styles.circleOverlay} />
          </Camera>
          <Button title="Take Picture" onPress={takePicture} disabled={loading} />
          {loading && <ActivityIndicator size="large" color="#00ff00" style={styles.activityIndicator} />}
        </>
      ) : (
        <Image source={{ uri: image }} style={styles.image} />
      )}
    </View>

import { TextInput } from 'react-native';

function ExplorerForm() {
  const [customerNo, setCustomerNo] = useState('');
  const [oldMeterNo, setOldMeterNo] = useState('');
  const [exchangeDate, setExchangeDate] = useState('');
  const [newMeterNo, setNewMeterNo] = useState('');

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="お客様番号"
        value={customerNo}
        onChangeText={setCustomerNo}
        style={styles.input}
      />
      <TextInput
        placeholder="旧メーター番号"
        value={oldMeterNo}
        onChangeText={setOldMeterNo}
        style={styles.input}
      />
      <TextInput
        placeholder="メーター交換日"
        value={exchangeDate}
        onChangeText={setExchangeDate}
        style={styles.input}
      />
      <TextInput
        placeholder="新メーター番号"
        value={newMeterNo}
        onChangeText={setNewMeterNo}
        style={styles.input}
      />
    </View>
  );
}

  );
}
export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <CameraComponent />
      <ExplorerForm />
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  activityIndicator: {
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  structuredTextContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 20,
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden', // Ensures the circle is clipped to the image bounds
  },
  circleOverlay: {
    position: 'absolute',
    top: '25%', // Adjust as needed to center the circle vertically
    left: '25%', // Adjust as needed to center the circle horizontally
    width: '50%', // 50% of the image container width
    height: '50%', // 50% of the image container height
    borderRadius: 100, // Makes it a circle
    borderWidth: 2,
    borderColor: '#00ff00', // Bright green color
    backgroundColor: 'transparent',
  },
});
