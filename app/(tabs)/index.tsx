import { useState } from 'react';
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
        const response = await fetch(`https://qwfcxeoobajwhfikeqpp.supabase.co/functions/v1/get-business-name?business_code=${number}`);
        const data = await response.json();
        setBusinessName(data.name || 'Not Found');
      } catch (error) {
        setBusinessName('Error fetching name');
      }
    } else {
      setBusinessName('');
    }
  };

  >
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
    </ParallaxScrollView>
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







      </ThemedView>
      <CameraComponent />      <ExplorerForm />
      

>>    </ParallaxScrollView>
  );
}

// ここから下にExplorerFormを定義
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
