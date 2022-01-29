import React, { useState, useEffect} from 'react';
import {
    StyleSheet, View, Dimensions,
    Animated, Easing, TouchableOpacity, Text
}
    from 'react-native';
import MapView, { Marker} from 'react-native-maps';
import * as Linking from "expo-linking";


const MapScreen = ({ navigation }) => {
    //mapde konumdan sonra çıkan animasyon
    const [growValue] = useState(new Animated.Value(0));
    const grow = growValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0', '10'],
    });
    useEffect(() => {
        Animated.loop(
            Animated.timing(growValue, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
    }, [growValue]);
    //virgüle göre qrdan gelen veriyi split ediyor
    let qrLocation = navigation.state.params.qrlocation.split(",")
    console.log(qrLocation, "split")

    let myLocation = navigation.state.params.mylocation;
    //split işleminden sonra belirleme
    const [mapRegion, setmapRegion] = useState({
        latitude: parseFloat(qrLocation[0]),
        longitude: parseFloat(qrLocation[1]),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    //google mapse yönlendiren bağlantı
    return <View >
        <TouchableOpacity
        style={styles.button}
        onPress={() => {
          Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${mapRegion.latitude},${mapRegion.longitude}&origin=${myLocation.coords.latitude},${myLocation.coords.longitude}`)
        }}>
        <Text style={styles.buttonText}>Press for direction</Text>
      </TouchableOpacity>

        <MapView
            region={mapRegion}
            style={styles.map}>
            <Marker
                coordinate={mapRegion}>

                <Animated.View
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        transform: [{ scale: grow }],
                        backgroundColor: '#1976d299',
                    }}
                />
            </Marker>
        </MapView>
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    button: {
        marginVertical: 10,
        height: 40,
        width:"100%",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#f0e1ee',
        borderColor:'black'
      },
      buttonText: {
        color: 'black',
        fontSize: 22,
      }
});


export default MapScreen;