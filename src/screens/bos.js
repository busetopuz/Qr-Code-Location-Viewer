import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { View, Platform, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Text, Linking } from "react-native";
import { aspectration, colors, layout } from "@constants";
import { StackScreenProps } from "@react-navigation/stack";
import {
  IFindAddressByLatLongRequest,
  IFindAddressByLatLongResponse,
  RootStackParamList,
} from "@types";
import { useDispatch } from "react-redux";
import {
  alertErrorMessage,
  castThunkAction,
  errorMessageAlert,
} from "@helpers";
import { findAddressByLatLong } from "@store/thunks/adress-thunks";
import { setCurrentAdress } from "@store/address/actions";
import { SafeArea } from "@components/SafeArea";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Region,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import Header from "@components/Header";
import BlueButton from "@components/BlueButton";
import LottieView from 'lottie-react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function NewAddress({
  navigation,
}: StackScreenProps<RootStackParamList>) {
  const dispatch = useDispatch();

  const [region, setRegion] = useState<Region>({
    latitude: 41.0841135,
    latitudeDelta: 0.0015,
    longitude: 29.0310147,
    longitudeDelta: 0.0015,
  });

  const [loading, setLoading] = useState(true);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      errorMessageAlert("Konuma erişim izni reddedildi", () => {
        Linking.openSettings();
      });
    }

    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});

      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const onMaps = async () => {
      await getLocation();
    };
    onMaps();
  }, []);

  const onFindAddressByLatLong = (request: IFindAddressByLatLongRequest) => {
    castThunkAction<IFindAddressByLatLongResponse>(
      dispatch(findAddressByLatLong(request))
    ).then((res) => {
      if (res.success && res.data) {
        // const countyName = res.data?.countyName
        //   ? capitalize(res.data.countyName.toLowerCase())
        //   : "";
        dispatch(
          setCurrentAdress({
            cityId: res.data.cityId,
            cityName: res.data.cityName,
            countyId: res.data.countyId,
            countyName: res.data.countyName,
            description: res.data.description,
            neighborhoodId: res.data.neighborhoodId,
            neighborhoodName: res.data.neighborhoodName,
            streetId: res.data.streetId,
            latitude: request.latitude,
            longitude: request.longitude,
            title: "",
          })
        );
        navigation.navigate("NewAddress1");
      } else if (res.errorCode === 94) {
        alertErrorMessage(res.errorMessage, () => {
          navigation.navigate("AddAddress");
        })
      } else if (res.errorCode === 89) {
        alertErrorMessage(res.errorMessage, () => {
          navigation.navigate("AddAddress");
        })
      } else {
        alertErrorMessage('Bir hata oluştu. Manual adres seçme ekranına yönlendiriyorsunuz.', () => {
          navigation.navigate("AddAddress");
        })
      }
    });
  };

  // const onGoogleMaps = (lat: number, lng: number, callback = () => {}) => {
  //   dispatch(toggleLoader());
  //   console.log("onGoogleMaps", lat, lng);
  //   axios.get(googleMapUrl(lat, lng)).then((res) => {
  //     if (res && res.data && res.data.results && res.data.results.length > 0) {
  //       setAdressText(res.data.results[0].formatted_address);
  //     }
  //     callback();

  //     dispatch(hideLoader());
  //   });
  // };

  const onRegionChange = (req: Region) => {
    setRegion(req);
  };

  const onAddress = () => {
    onFindAddressByLatLong({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  if (loading) {
    return (
      <  SafeArea>
        <Header
          headerText="Yeni Adres Ekle"
          onPress={() => navigation.goBack()}
          navigation={navigation}
        />


        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LottieView source={require("@assets/lotieGif.json")} autoPlay loop />
        </View>
      </SafeArea>
    );
  }
  // if (!loading) {
  return (
    <SafeArea>
      <Header
        headerText="Yeni Adres Ekle"
        onPress={() => navigation.goBack()}
        navigation={navigation}
        bgColor="pink"
      />




         <View style={{ flex: 1,backgroundColor:'pink' }}>
        <MapView
          provider={
            Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          // loadingEnabled 
          // loadingIndicatorColor={"#1D70B7"}

          style={{ width: layout.width, height: layout.height }}
          region={region}
          showsUserLocation={false}
          onRegionChangeComplete={(e: Region) => onRegionChange(e)}
          scrollEnabled={true}
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}
            image={require("@assets/images/location_pin.png")}
          />
        </MapView>
      </View>

     

      <LinearGradient colors={[ '#1D70B7', '#009EE2']} style={{
        marginHorizontal: aspectration(20, 'W'),
        marginVertical: aspectration(40, 'H'),
        flexDirection: "row",
        width: "85%",
        justifyContent: 'space-around',
        backgroundColor: "#1D70B7",
        height: aspectration(50, "H"),
        alignItems: "center",
        borderRadius: aspectration(10, "H"),
        marginLeft: aspectration(32, 'W'),

      }} start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}>

      

        <TouchableOpacity onPress={() => navigation.navigate("AddAddress")} >

          <Text style={{ color: "white", fontWeight: "bold" }}> Manuel Adres Ekle </Text>
        </TouchableOpacity>
        <View style={{ width: "0.3%", borderBottomColor: "white", borderBottomWidth: 30, alignSelf: 'center', }} />

        <TouchableOpacity onPress={() => onAddress()} >
          <Text style={{ color: "white", fontWeight: "bold" }}> Bu Adresi Kullan </Text>
        </TouchableOpacity>

        </LinearGradient>







      {/* <View style={{ marginHorizontal: aspectration(20, 'W'), marginVertical: aspectration(40, 'H') }}>
        <BlueButton

          buttonText="Manual Adres Ekle"
          onPress={() => navigation.navigate("AddAddress")}
        />
      </View> */}
    </SafeArea>
  );
  // }
}