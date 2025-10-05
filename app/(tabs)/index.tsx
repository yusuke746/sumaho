import { useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native';

import { StyleSheet, TextInput, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import Constants from 'expo-constants';
import { OpenAI } from 'openai';

const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

export default function BusinessNumberScreen() {
  const [businessNumber, setBusinessNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [jsonResult, setJsonResult] = useState('');

  const fetchBusinessName = async (number: string) => {
    if (number.length > 0) {
      try {
        const response = await fetch(
          `https://qwfcxeoobajwhfikeqpp.supabase.co/functions/v1/get-business-name?business_code=${number}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        setBusinessName(data.name || 'Not Found');
      } catch (error) {
        setBusinessName('Error fetching name');
      }
    } else {
      setBusinessName('');
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      try {
        // 画像データをbase64で取得
        const asset = result.assets[0];
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result?.toString().split(',')[1];
          // OpenAI APIリクエスト
          const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4-turbo', // ← ここを修正
              messages: [
                {
                  role: 'user',
                  content: [
                    { type: 'text', text: 'この画像を解析してJSON形式で返してください。' },
                    { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64data}` } }
                  ]
                }
              ],
              max_tokens: 1024
            }),
          });
          const openaiData = await openaiRes.json();
          setJsonResult(JSON.stringify(openaiData, null, 2));
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        setJsonResult('Error analyzing image');
      }
    }
  };

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

    <ParallaxScrollView>
      <>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          {jsonResult && (
            <View style={{ padding: 16 }}>
              <ThemedText>OpenAI解析結果:</ThemedText>
              <View>
                <TextInput
                  style={{ height: 200, borderColor: 'gray', borderWidth: 1, color: 'black' }}
                  value={jsonResult}
                  multiline
                  editable={false}
                />
              </View>
            </View>
          )}
        </ThemedView>
        <View style={styles.formContainer}>
          <ThemedText>指定工事店番号:</ThemedText>
          <TextInput
            style={styles.textInput}
            placeholder="指定工事店番号を入力"
            keyboardType="numeric"
            value={businessNumber}
            onChangeText={(text) => {
              setBusinessNumber(text);
              fetchBusinessName(text);
            }}
          />
          <ThemedText>指定工事店名: {businessName}</ThemedText>
        </View>
        <Button title="読み取り" onPress={handlePickImage} />
        <ExplorerForm />
      </>

    </ParallaxScrollView>
  );
}

// ExplorerForm用のスタイルを別名で定義
const explorerStyles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    color: 'black',
  },
  // 必要なら他のスタイルもここに追加
});

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
        style={explorerStyles.input}
      />
      <TextInput
        placeholder="旧メーター番号"
        value={oldMeterNo}
        onChangeText={setOldMeterNo}
        style={explorerStyles.input}
      />
      <TextInput
        placeholder="メーター交換日"
        value={exchangeDate}
        onChangeText={setExchangeDate}
        style={explorerStyles.input}
      />
      <TextInput
        placeholder="新メーター番号"
        value={newMeterNo}
        onChangeText={setNewMeterNo}
        style={explorerStyles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
    marginBottom: 16,
  },
  formContainer: {
    padding: 16,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    color: 'black',
  },
});
