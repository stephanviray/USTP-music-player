// QRCodeScannerScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const QRCodeScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const askForPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  if (hasPermission === null) {
    askForPermission();
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : ({ type, data }) => {
          setScanned(true);
          console.log(`Scanned barcode: ${data}`);
          // Handle the scanned data (e.g., redeem points)
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Text style={styles.text} onPress={() => setScanned(false)}>
          Tap to Scan Again
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    padding: 10,
    backgroundColor: 'white',
  },
});

export default QRCodeScannerScreen;
