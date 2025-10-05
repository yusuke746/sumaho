import { useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native';

import { StyleSheet, TextInput, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function BusinessNumberScreen() {
  const [businessNumber, setBusinessNumber] = useState('');
  const [businessName, setBusinessName] = useState('');

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
      // 画像取得後の処理
      console.log(result.assets[0].uri);
    }
  };

  return (
    <ParallaxScrollView>
      <>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
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
        {/* ExplorerFormを追加 */}
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
