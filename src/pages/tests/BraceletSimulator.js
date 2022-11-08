import React, { useState, useEffect } from "react";
import { Text, Button, View } from "react-native";
import BraceletSimulatorStyles from "./BraceletSimulatorStyles";
import DropdownFenceBracelet from "../../components/fence-bracelet/DropdownFenceBracelet";
import Coords from "../../utils/Coordinates";

import LocationService from '../../services/LocationService';

export default function BraceletSimulator() {
  const locationService = new LocationService();

  const [location, setLocation] = useState(false);
  const [bracelets, setBracelets] = useState([]);
  const [watchID, setWatchID] = useState();

  useEffect(() => {
    if (location) {
      sendLocation();
    }
  }, [location]);

  const sendLocation = () => {
    bracelets.forEach(element => {
      const request = {
        braceletId: element,
        coordinate: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }
      }
      locationService.create(request);
    });
  }

  const getLocation = () => {
    Coords.getLocation(
      (position) => setLocation(position),
      (error) => alert("Não foi possível obter a localização"),
    );
  }

  const watchLocation = () => {
    if (watchID) {
      Coords.cleanWatchLocation(watchID);
      setWatchID(undefined);
    } else {
      const res = Coords.watchLocation(
        (position) => setLocation(position),
        (error) => alert("Não foi possível obter a localização"),
      );
      setWatchID(res);
    }
  }

  return (
    <View style={BraceletSimulatorStyles.container}>
      <Text style={BraceletSimulatorStyles.text}>Simulador de Pulseira</Text>
      <DropdownFenceBracelet value={bracelets} setValue={setBracelets} />
      <View style={BraceletSimulatorStyles.options}>
        <Button title="Obter Localização" onPress={getLocation} style={BraceletSimulatorStyles.button}/>
        {/* <View style={BraceletSimulatorStyles.space}/>
        <Button title={watchID ? "Parar Monitoramento" : "Monitorar Localização"} onPress={watchLocation} style={BraceletSimulatorStyles.button}/> */}
        <View style={BraceletSimulatorStyles.coordinatesContainer}>
          <Text>Latitude: {location ? location.coords.latitude : null}</Text>
          <Text>Longitude: {location ? location.coords.longitude : null}</Text>
        </View>
        <Button title="Enviar Localização" style={BraceletSimulatorStyles.button} onPress={() => sendLocation()}/>
      </View>
    </View>
  );
}
