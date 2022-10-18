import React, { useEffect, useState } from "react";
import {ScrollView, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import DropdownFenceBracelet from "../../components/fence-bracelet/DropdownFenceBracelet";
import FenceBraceletService from "../../services/FenceBraceletService";
import FenceService from "../../services/FenceService";
import { fenceStyles } from "./fenceStyles";

function FenceCreateEdit(props) {
  const fenceService = new FenceService();
  const fenceBraceletService = new FenceBraceletService();

  const [fence, setFence] = useState();

  const [name, setName] = useState("");
  const [radius, setRadius] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [startTime, setStartTime] = useState("");
  const [finishTime, setfinishTime] = useState("");
  const [bracelets, setBracelets] = useState([]);

  const [isActive, setIsActive] = useState();
  const toggleSwitch = () => {
    setIsActive(prevState => !prevState);
    // fenceService.statusActive(props.route.params.item);
  }

  useEffect(() => {
    if (props.route.params.item) {
      setFence(props.route.params.item);
      setName(props.route.params.item.name);
      setLatitude(props.route.params.item.coordinate.latitude);
      setLongitude(props.route.params.item.coordinate.longitude);
      setStartTime(props.route.params.item.startTime);
      setfinishTime(props.route.params.item.finishTime);
      setRadius(props.route.params.item.radius);
      setBracelets(props.route.params.item.bracelets.map((brac) => brac.id));
      setIsActive(props.route.params.item.active);
    }
  }, [props]);

  const onPressHandler = async () => {
    const fenc = {
      id: fence ? fence.id : undefined,
      name: name,
      coordinate: {
        latitude: latitude,
        longitude: longitude,
      },
      startTime: startTime,
      finishTime: finishTime,
      radius: radius,
    };

    try {
      var response;
      if (fence) {
        response = await fenceService.update(fenc.id, fenc);
        response.data.bracelets.forEach((braceletID) => {
          const fenceBracelet = {
            fence: response.data.id,
            bracelet: braceletID.id,
          };
          fenceBraceletService.delete(fenceBracelet);
        });
      } else {
        response = await fenceService.create(fenc);
      }
      bracelets.forEach((braceletID) => {
        const fenceBracelet = {
          fence: response.data.id,
          bracelet: braceletID,
        };
        fenceBraceletService.save(fenceBracelet);
      });
      props.navigation.goBack();
    } catch (error) {
      console.log(error);
    }

    fenceService.statusActive(fenc.id, {active: isActive})
        .then(response => {
              console.log('Response ' + response.data.content);
            }
        ).catch(error => {
      console.log(error.response);
    })
  };

  return (
      <View style={fenceStyles.container}>
        <Text style={fenceStyles.title}>
          {fence ? "Edição de cerca" : "Criação de cerca"}
        </Text>
        <View style={fenceStyles.body}>
          <DropdownFenceBracelet value={bracelets} setValue={setBracelets} />
          <View style={fenceStyles.toggle}>
            <Text>Ativar pulseira: </Text>
            <Switch
                disabled={bracelets.length == 0 ? true : false}
                trackColor={{false: "#767577", true: "#81b0ff"}}
                thumbColor={isActive ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isActive}
            />
          </View>

          {/*{bracelets.length > 0 ? renderSwitch() : <Text>"Vincule uma pulseira"</Text>}*/}
          <ScrollView>
            <View style={fenceStyles.register}>
              <TextInput
                  style={fenceStyles.input}
                  placeholder="Nome da cerca"
                  placeholderTextColor="#808080"
                  onChangeText={(value) => setName(value)}
                  value={name}
              />

              <TextInput
                  style={fenceStyles.input}
                  placeholder="Latitude"
                  placeholderTextColor="#808080"
                  onChangeText={(value) => setLatitude(value)}
                  value={`${latitude ? latitude : ""}`}
                  keyboardType="numeric"
              />

              <TextInput
                  style={fenceStyles.input}
                  placeholder="Longitude"
                  placeholderTextColor="#808080"
                  onChangeText={(value) => setLongitude(value)}
                  value={`${longitude ? longitude : ""}`}
                  keyboardType="numeric"
              />

              <TextInput
                  style={fenceStyles.input}
                  placeholder="Raio"
                  placeholderTextColor="#808080"
                  onChangeText={(value) => setRadius(value)}
                  value={`${radius ? radius : ""}`}
                  keyboardType="numeric"
              />

              <TextInput
                  style={fenceStyles.input}
                  placeholder="12:00"
                  placeholderTextColor="#808080"
                  onChangeText={(value) => setStartTime(value)}
                  value={startTime}
              />

              <TextInput
                  style={fenceStyles.input}
                  placeholder="18:00"
                  placeholderTextColor="#808080"
                  onChangeText={(value) => setfinishTime(value)}
                  value={finishTime}
              />
              <TouchableOpacity style={fenceStyles.button} onPress={onPressHandler}>
                <Text style={fenceStyles.text}>
                  {fence ? "SALVAR" : "REGISTRAR"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
  );
}

export default FenceCreateEdit;
