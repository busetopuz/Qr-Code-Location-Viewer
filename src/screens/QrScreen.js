import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from "expo-location";


const QrScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrlocation, setQrLocation] = useState('Not yet scanned');


  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }
  // Kamera erişim izni
  useEffect(() => {
    askForCameraPermission();
  }, []);
  
  const [locations, setLocation] = useState(null)
  
  console.log(locations, "BENİM KONUMUM")

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        console.log(errorMsg);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

    })();
  }, []);


  // Barcode okununca data qrLocation'a setleniyor.
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setQrLocation(data)
    console.log(data);
    // console.log('Type: ' + type + '\nData: ' + data)
  };

  // Kamera izni kontrolü
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }
  
  // View 
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }} />
      </View>
      <Text style={styles.maintext}>{qrlocation}</Text>

      {scanned && 
      <TouchableOpacity 
      style={styles.button1}
      onPress={()=> setScanned(false)}>
      <Text style={styles.buttonText}>Scan Again?</Text>
      </TouchableOpacity>}

      {scanned &&
      <TouchableOpacity
        style={styles.button1}
        onPress={() => {
          navigation.navigate('Map', {
            mylocation: locations,
            qrlocation: qrlocation
          });
        }}>
        <Text style={styles.buttonText}>Go to Map</Text>

      </TouchableOpacity>}
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 18,
    margin: 20,

  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'gray'
  },
  button1: {
    marginVertical: 20,
    height: 50,
    width: 200,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#dfebe2'

  },
  buttonText: {
    color: 'black',
    fontSize: 22,
  }
});

export default QrScreen;