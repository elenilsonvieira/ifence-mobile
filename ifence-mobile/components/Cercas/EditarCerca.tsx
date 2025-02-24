import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atribuirPulseiraACerca, salvarCerca } from "./storage/cercaStorage";
import { Picker } from "@react-native-picker/picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";

type Pulseira = {
  nome: string;
  ativa: boolean;
  cercaId?: string;
};

// type Cerca = {
//   id: string;
//   nome: string;
//   latitude: string;
//   longitude: string;
//   raio: number;
//   ativa: boolean;
//   pulseiraId?: string;
// };

const EditarCerca = ({ cerca, onEditar, onExcluir, onAlternarSwitch }) => {
  const [selecionada, setSelecionada] = useState(false);
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(cerca.nome);
  const [raio, setRaio] = useState(cerca.raio.toString());
  const [cercaAtiva, setCercaAtiva] = useState(cerca.ativa || false);
  const [pulseiras, setPulseiras] = useState<Pulseira[]>([]);
  const [pulseiraSelecionada, setPulseiraSelecionada] = useState(
    cerca.pulseiraId || ""
  );

  useEffect(() => {
    const carregarPulseiras = async () => {
      const dados = await AsyncStorage.getItem("pulseiras");
      if (dados) {
        setPulseiras(JSON.parse(dados));
      }
    };
    carregarPulseiras();
  }, []);

  const alternarSwitch = (novoValor: boolean) => {
    setCercaAtiva(novoValor);
    onAlternarSwitch(cerca, novoValor);
  };

  const salvarEdicao = async () => {
    const novaCerca = {
      ...cerca,
      nome,
      raio: parseFloat(raio),
      ativa: cercaAtiva,
      pulseiraId: pulseiraSelecionada,
    };
    await salvarCerca(novaCerca);
    await atribuirPulseiraACerca(cerca.id, pulseiraSelecionada);
    onEditar(novaCerca);
    setEditando(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.cercaItem, selecionada && styles.cercaSelecionada]}
        onPress={() => setSelecionada(!selecionada)}
      >
        {editando ? (
          <View>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Nome da Cerca"
            />
            <TextInput
              style={styles.input}
              value={raio}
              onChangeText={setRaio}
              placeholder="Raio (metros)"
              keyboardType="numeric"
            />
            <Text style={styles.label}>Pulseira Associada:</Text>
            <Picker
              selectedValue={pulseiraSelecionada}
              onValueChange={(itemValue) => setPulseiraSelecionada(itemValue)}
            >
              <Picker.Item label="Nenhuma" value="" />
              {pulseiras.map((pulseira) => (
                <Picker.Item
                  key={pulseira.nome}
                  label={pulseira.nome}
                  value={pulseira.nome}
                />
              ))}
            </Picker>
          </View>
        ) : (
          <View>
            <Text style={styles.nome}>Cerca: {cerca.nome}</Text>
            <Text style={styles.textInfoLocations}>
              Latitude: {cerca.latitude}
            </Text>
            <Text style={styles.textInfoLocations}>
              Longitude: {cerca.longitude}
            </Text>
            <Text style={styles.textInfoLocations}>
              Raio: {cerca.raio} metros
            </Text>
            <Text style={styles.textInfoLocations}>
              Pulseira Associada: {cerca.pulseiraId || "Nenhuma"}
            </Text>
            <View style={styles.switchContainer}>
              <Switch
                value={cercaAtiva}
                onValueChange={alternarSwitch}
                trackColor={{ false: "#767577", true: "#95d5b2" }}
                thumbColor={cercaAtiva ? "#52b788" : "#f4f3f4"}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>

      {selecionada && (
        <View style={styles.botoes}>
          {editando ? (
            <TouchableOpacity style={styles.botaoSalvar} onPress={salvarEdicao}>
              <Text style={styles.textoBotao}>Salvar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.botaoEditar}
              onPress={() => setEditando(true)}
            >
              <Text style={styles.textoBotao}>Editar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={() => onExcluir(cerca.id)}
          >
            <Text style={styles.textoBotao}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cercaItem: {
    backgroundColor: "#003F88",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cercaSelecionada: {
    borderWidth: 2,
    borderColor: "#118ab2",
    elevation: 5,
  },
  nome: {
    fontWeight: "bold",
    color: "#FFF",
    fontSize: 18,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 5,
  },
  botaoEditar: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 4,
  },
  botaoExcluir: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 4,
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
  },
  textInfoLocations: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: "#000000",
  },
  botaoSalvar: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
  },
  switchContainer: {
    alignSelf: "flex-start",
  },
  label: {
    color: "#000000",
    fontSize: 17,
  },
});

export default EditarCerca;
