import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Circle, Marker, PROVIDER_GOOGLE, UrlTile } from "react-native-maps";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import HeaderBrand from "../../components/HeaderBrand";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing, moderateScale } from "../../utils/responsive";

const Map = () => {
  const colors = useDaltonicColors();
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);
  const mapRef = useRef<MapView | null>(null);

  const params = useLocalSearchParams();
  const raio = Number(params.raio);
  const returnTo: "/(tabs)/ListarCercas" | "/Screens/AddCerca" =
    params.returnTo === "/Screens/AddCerca" ? "/Screens/AddCerca" : "/(tabs)/ListarCercas";

  const [mapType, setMapType] = useState<"standard" | "hybrid">("standard");
  const googleApiKey = (Constants.expoConfig as any)?.android?.config?.googleMaps?.apiKey || (Constants.expoConfig as any)?.ios?.config?.googleMapsApiKey;
  // Preferir um provedor de tiles permitido (ex.: MapTiler, Stadia, Thunderforest, etc.)
  const mapTilerKey = (Constants.expoConfig as any)?.extra?.MAPTILER_KEY;
  const customTileTemplateFromConfig = (Constants.expoConfig as any)?.extra?.MAP_TILES_URL as string | undefined;
  const customTileTemplate = customTileTemplateFromConfig || (mapTilerKey ? `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${mapTilerKey}` : undefined);
  const customAttribution = (Constants.expoConfig as any)?.extra?.MAP_TILES_ATTRIBUTION as string | undefined;
  const useCustomTiles = !googleApiKey && !!customTileTemplate; // fallback quando não houver chave configurada
  const useGoogleProvider = !!googleApiKey;
  const isAndroidNoTilesConfigured = Platform.OS === 'android' && !useGoogleProvider && !customTileTemplate;

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
        style={{ flex: 1 }}
        ref={mapRef}
        mapType={mapType}
  provider={useGoogleProvider ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: location?.latitude ?? 0,
          longitude: location?.longitude ?? 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        showsUserLocation={true}
      >
    {useCustomTiles && (
          <UrlTile
      /* Tiles customizáveis (evita bloqueio do OSM) */
      urlTemplate={customTileTemplate!}
            zIndex={-1}
            maximumZ={22}
            flipY={false}
          />
        )}
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

      {isAndroidNoTilesConfigured && (
        <View style={styles.missingTilesBox} pointerEvents="none">
          <Text style={styles.missingTilesTitle}>Mapas não configurados</Text>
          <Text style={styles.missingTilesText}>
            Configure uma chave do Google Maps no app.json ou defina expo.extra.MAP_TILES_URL (ex: MapTiler).
          </Text>
        </View>
      )}

      {useCustomTiles && (
        <View style={styles.attributionBox} pointerEvents="none">
          <Text style={styles.attributionText}>
            {customAttribution || '© Map data © OpenStreetMap contributors, Tiles by MapTiler'}
          </Text>
        </View>
      )}

      {/* Overlays abaixo do header respeitando safe area */}
  <Link href={returnTo} asChild>
        <TouchableOpacity style={[styles.button, { top: insets.top + moderateScale(12), left: spacing(2) }]}>
          <AntDesign name="arrowleft" size={35} color="#03045e" />
        </TouchableOpacity>
      </Link>

      <Link
        href={{
          pathname: returnTo,
          params: {
            latitude: location?.latitude?.toString(),
            longitude: location?.longitude?.toString(),
          },
        }}
        asChild
      >
        <TouchableOpacity style={[styles.BtnconfirmLocation, { backgroundColor: colors.button, padding: spacing(2), borderRadius: 6 }] }>
          <Text style={[styles.textConfirmLocation, { color: colors.buttonText }]}>Confirmar localização</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity style={[styles.bn, { top: insets.top + moderateScale(20), right: spacing(2), padding: spacing(1) }]} onPress={toggleMapType}>
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
  borderRadius: moderateScale(10),
  },
  BtnconfirmLocation: {
     position: "absolute",
  bottom: spacing(2),
     alignSelf: "center",
  },
  textConfirmLocation: {
     fontSize: moderateScale(16),
     fontWeight: "600",
  },
  boxInfo: {
    backgroundColor: "#003F88",
    position: "absolute",
  bottom: spacing(12.5),
    alignSelf: "center",
  padding: spacing(1.5),
  borderRadius: moderateScale(5),
  },
  bn: {
    position: "absolute",
     alignSelf: "flex-end",
     backgroundColor: "#003F88",
   borderRadius: moderateScale(5),
     flexDirection: "row",
  },
  buttonText: {
    color: "#FFFFFF",
  },
  iconLayer: {
  paddingRight: spacing(0.5),
    color: "#ffffff",
  },
  attributionBox: {
    position: 'absolute',
    bottom: spacing(0.5),
    right: spacing(0.5),
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: spacing(0.5),
    paddingVertical: 2,
    borderRadius: 4,
  },
  attributionText: {
    fontSize: moderateScale(10),
    color: '#333',
  },
  missingTilesBox: {
    position: 'absolute',
    bottom: spacing(7),
    left: spacing(1),
    right: spacing(1),
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: spacing(1.5),
    borderRadius: 8,
  },
  missingTilesTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: moderateScale(14),
    marginBottom: spacing(0.5),
    textAlign: 'center',
  },
  missingTilesText: {
    color: '#fff',
    fontSize: moderateScale(12),
    textAlign: 'center',
  },
});

export default Map;
