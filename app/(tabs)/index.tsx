import { Image } from 'expo-image';
import { ActivityIndicator, Button, Platform, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import { getStructuredTextFromImage } from '@/utils/gemini';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
function CameraComponent() {
  const [image, setImage] = useState<string | null>(null);
  const [structuredText, setStructuredText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const pickImage = async () => {
    setLoading(true);
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Request base64 for Gemini API
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      if (result.assets[0].base64) {
        const structured = await getStructuredTextFromImage(result.assets[0].base64);
        setStructuredText(structured ?? null);
      }
    }
    setLoading(false);
  };

  return (
    <ThemedView style={styles.cameraContainer}>
      <Button title="Launch Camera" onPress={pickImage} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#00ff00" style={styles.activityIndicator} />} {/* Bright green color */}
      {image && !loading && (
        <ThemedView style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.circleOverlay} />
        </ThemedView>
      )}
      {structuredText && (
        <ThemedView style={styles.structuredTextContainer}>
          <ThemedText type="subtitle">Structured Text:</ThemedText>
          <ThemedText>{structuredText}</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
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
