import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import HeaderBrand from "../../components/HeaderBrand";

const Map = () => {
  const colors = useDaltonicColors();
  const [location, setLocation] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);
  const mapRef = useRef<MapView | null>(null);

  const params = useLocalSearchParams();
  const raio = Number(params.raio);

  const [mapType, setMapType] = useState<"standard" | "hybrid">("standard");

  const toggleMapType = () => {
    setMapType((prevType) => (prevType === "standard" ? "hybrid" : "standard"));
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissão negada",
            "Você precisa permitir o acesso à localização."
          );
          return;
        }

        let { coords } = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        setLocation(userLocation);

        // Centraliza o mapa na localização obtida
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01, 
            longitudeDelta: 0.01,
          });
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível obter a localização.");
      } finally {
        // setLoading(false); // removido pois não existe
      }
    };

    getLocation();
  }, []);

  const handleMapPress = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number }}}) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <HeaderBrand />
      <MapView
        style={[StyleSheet.absoluteFill, { top: 64 }]}
        ref={mapRef}
        mapType={mapType}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location?.latitude ?? 0,
          longitude: location?.longitude ?? 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        showsUserLocation={true}
      >
        {location && (
          <Marker coordinate={location}>
            <Image source={require("@/assets/images/IconLocation.png")} />
          </Marker>
        )}

        {location && (
          <Circle
            center={location}
            radius={raio}
            strokeWidth={2}
            strokeColor="rgba(0, 0, 255, 0.5)" 
            fillColor="rgba(0, 0, 255, 0.2)" 
          />
        )}
      </MapView>

      {/* Ajustar botões para descerem abaixo do header */}
      <Link href={"/Screens/AddCerca"} asChild>
        <TouchableOpacity style={[styles.button, { top: 84 }]}>
          <AntDesign name="arrowleft" size={35} color="#03045e" />
        </TouchableOpacity>
      </Link>

      <Link
        href={{
          pathname: "/(tabs)/ListarCercas",
          params: {
            latitude: location?.latitude?.toString(),
            longitude: location?.longitude?.toString(),
            from: 'modal',
          },
        }}
        asChild
      >
        <TouchableOpacity style={[styles.BtnconfirmLocation, { backgroundColor: colors.button }] }>
          <Text style={[styles.textConfirmLocation, { color: colors.buttonText }]}>Confirmar localização</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity style={[styles.bn, { top: 94 }]} onPress={toggleMapType}>
        <MaterialIcons style={styles.iconLayer} name="layers" size={18} />
        <Text style={styles.buttonText}>
          {mapType === "standard" ? "Modo Híbrido" : "Modo Padrão"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 40,
    left: 20,
    borderRadius: 10,
  },
  BtnconfirmLocation: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    padding: 13,
    borderRadius: 5,
  },
  textConfirmLocation: {
    fontSize: 16,
    fontWeight: "600",
  },
  boxInfo: {
    backgroundColor: "#003F88",
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    padding: 15,
    borderRadius: 5,
  },
  bn: {
    position: "absolute",
    top: 70,
    right: 10,
    alignSelf: "flex-end",
    backgroundColor: "#003F88",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
  },
  buttonText: {
    color: "#FFFFFF",
  },
  iconLayer: {
    paddingRight: 5,
    color: "#ffffff",
  },
});

export default Map;
