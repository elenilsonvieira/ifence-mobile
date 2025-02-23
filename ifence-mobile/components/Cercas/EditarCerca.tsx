import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Switch } from "react-native";

const EditarCerca = ({ cerca, onEditar, onExcluir }) => {
  const [selecionada, setSelecionada] = useState(false);
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(cerca.nome);
  const [raio, setRaio] = useState(cerca.raio.toString());

  const toggleSelecionada = () => {
    setSelecionada(!selecionada);
    setEditando(false);
  };

  const iniciarEdicao = () => {
    setEditando(true);
  };

  const salvarEdicao = () => {
    const novaCerca = { ...cerca, nome, raio: parseFloat(raio) };
    onEditar(novaCerca);
    setEditando(false);
  };

  return (
    // <View>
    //   <TouchableOpacity
    //     style={[styles.cercaItem, selecionada && styles.cercaSelecionada]}
    //     onPress={toggleSelecionada}
    //   >
    //     {/* <Text style={styles.nome}>Cerca: {cerca.nome}</Text>
    //     <Text style={styles.textInfoLocations}>Latitude: {cerca.latitude}</Text>
    //     <Text style={styles.textInfoLocations}>Longitude: {cerca.longitude}</Text>
    //     <Text style={styles.textInfoLocations}>Raio: {cerca.raio} metros</Text> */}
    //     {editando ? (
    //       <View>
    //         <TextInput
    //           style={styles.input}
    //           value={nome}
    //           onChangeText={setNome}
    //           placeholder="Nome da Cerca"
    //         />
    //         <TextInput
    //           style={styles.input}
    //           value={raio}
    //           onChangeText={setRaio}
    //           placeholder="Raio (metros)"
    //           keyboardType="numeric"
    //         />
    //       </View>
    //     ) : (
    //       <View>
    //         <Text style={styles.nome}>{cerca.nome}</Text>
    //         <Text style={styles.textInfoLocations}>
    //           Latitude: {cerca.latitude}
    //         </Text>
    //         <Text style={styles.textInfoLocations}>
    //           Longitude: {cerca.longitude}
    //         </Text>
    //         <Text style={styles.textInfoLocations}>
    //           Raio: {cerca.raio} metros
    //         </Text>
    //       </View>
    //     )}
    //   </TouchableOpacity>

    //   {selecionada && (
    //     <View style={styles.botoes}>
    //       <TouchableOpacity
    //         style={styles.botaoEditar}
    //         onPress={() => onEditar(cerca)}
    //       >
    //         <Text style={styles.textoBotao}>Editar</Text>
    //       </TouchableOpacity>
    //       <TouchableOpacity
    //         style={styles.botaoExcluir}
    //         onPress={() => onExcluir(cerca.id)}
    //       >
    //         <Text style={styles.textoBotao}>Excluir</Text>
    //       </TouchableOpacity>
    //     </View>
    //   )}
    // </View>

    <View>
      <TouchableOpacity
        style={[styles.cercaItem, selecionada && styles.cercaSelecionada]}
        onPress={toggleSelecionada}
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
          </View>
        ) : (
          <View>
            <Text style={styles.nome}>Cerca: {cerca.nome}</Text>
            <Text style={styles.textInfoLocations}>Latitude: {cerca.latitude}</Text>
            <Text style={styles.textInfoLocations}>Longitude: {cerca.longitude}</Text>
            <Text style={styles.textInfoLocations}>Raio: {cerca.raio} metros</Text>
            <Switch />
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
            <TouchableOpacity style={styles.botaoEditar} onPress={iniciarEdicao}>
              <Text style={styles.textoBotao}>Editar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.botaoExcluir} onPress={() => onExcluir(cerca.id)}>
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
    borderRadius: 5,
  },
  botaoExcluir: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
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
  }
});

export default EditarCerca;
