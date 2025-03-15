// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useLocalSearchParams } from "expo-router";

// const ListarRotasPulseira = () => {
//   const { pulseiraId, cercaId } = useLocalSearchParams();
//   const [localizacoes, setLocalizacoes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Carrega as localizações salvas
//   useEffect(() => {
//     const carregarLocalizacoes = async () => {
//       try {
//         const chave = `localizacoes_${cercaId}`;
//         const localizacoesSalvas = await AsyncStorage.getItem(chave);
//         if (localizacoesSalvas) {
//           setLocalizacoes(JSON.parse(localizacoesSalvas));
//         }
//       } catch (error) {
//         console.error("Erro ao carregar localizações:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     carregarLocalizacoes();
//   }, [cercaId]);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#004A99" />
//       </View>
//     );
//   }

//   if (localizacoes.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.texto}>Nenhuma localização encontrada.</Text>
//       </View>
//     );
//   }

//   // Calcula a região inicial do mapa com base nas localizações
//   const coordenadasIniciais = {
//     latitude: localizacoes[0].latitude,
//     longitude: localizacoes[0].longitude,
//     latitudeDelta: 0.01,
//     longitudeDelta: 0.01,
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={StyleSheet.absoluteFillObject}
//         initialRegion={coordenadasIniciais}
//         mapType="hybrid"
//       >
//         {/* Desenha a rota percorrida */}
//         <Polyline
//           coordinates={localizacoes}
//           strokeColor="#FF0000"
//           strokeWidth={3}
//         />

//         {/* Marca o ponto inicial */}
//         <Marker
//           coordinate={{
//             latitude: localizacoes[0].latitude,
//             longitude: localizacoes[0].longitude,
//           }}
//           title="Início"
//           pinColor="green"
//         />

//         {/* Marca o ponto final */}
//         <Marker
//           coordinate={{
//             latitude: localizacoes[localizacoes.length - 1].latitude,
//             longitude: localizacoes[localizacoes.length - 1].longitude,
//           }}
//           title="Fim"
//           pinColor="red"
//         />
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   texto: {
//     fontSize: 18,
//     textAlign: "center",
//     marginTop: 20,
//     color: "#004A99",
//   },
// });

// export default ListarRotasPulseira;




// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useLocalSearchParams } from "expo-router";

// const ListarRotasPulseiras = () => {
//   const { pulseiraId, cercaId } = useLocalSearchParams();
//   const [localizacoes, setLocalizacoes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cerca, setCerca] = useState(null);

//   // Carrega as localizações salvas e os dados da cerca
//   useEffect(() => {
//     const carregarDados = async () => {
//       try {
//         // Carrega as localizações
//         const chaveLocalizacoes = `localizacoes_${cercaId}`;
//         const localizacoesSalvas = await AsyncStorage.getItem(chaveLocalizacoes);
//         if (localizacoesSalvas) {
//           setLocalizacoes(JSON.parse(localizacoesSalvas));
//         }

//         // Carrega os dados da cerca
//         const chaveCercas = "cercas";
//         const cercasSalvas = await AsyncStorage.getItem(chaveCercas);
//         if (cercasSalvas) {
//           const cercas = JSON.parse(cercasSalvas);
//           const cercaEncontrada = cercas.find((c) => c.id === cercaId);
//           if (cercaEncontrada) {
//             setCerca(cercaEncontrada);
//           }
//         }
//       } catch (error) {
//         console.error("Erro ao carregar dados:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     carregarDados();
//   }, [cercaId]);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#004A99" />
//       </View>
//     );
//   }

//   if (localizacoes.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.texto}>Nenhuma localização encontrada.</Text>
//       </View>
//     );
//   }

//   // Calcula a região inicial do mapa com base nas localizações
//   const coordenadasIniciais = {
//     latitude: localizacoes[0].latitude,
//     longitude: localizacoes[0].longitude,
//     latitudeDelta: 0.01,
//     longitudeDelta: 0.01,
//   };

//   // Função para exibir a mensagem ao clicar no marcador
//   const exibirMensagem = (localizacao) => {
//     if (!cerca) return;

//     const hora = new Date(localizacao.timestamp).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     Alert.alert(
//       "Localização",
//       `A criança "${cerca.nome}" esteve aqui às ${hora}.`
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={StyleSheet.absoluteFillObject}
//         initialRegion={coordenadasIniciais}
//         mapType="hybrid"
//       >
//         {/* Desenha a rota percorrida */}
//         <Polyline
//           coordinates={localizacoes}
//           strokeColor="#FF0000" // Cor da linha
//           strokeWidth={3} // Espessura da linha
//         />

//         {/* Marca o ponto inicial */}
//         <Marker
//           coordinate={{
//             latitude: localizacoes[0].latitude,
//             longitude: localizacoes[0].longitude,
//           }}
//           title="Início"
//           pinColor="green"
//         />

//         {/* Marca o ponto final */}
//         <Marker
//           coordinate={{
//             latitude: localizacoes[localizacoes.length - 1].latitude,
//             longitude: localizacoes[localizacoes.length - 1].longitude,
//           }}
//           title="Fim"
//           pinColor="red"
//         />

//         {/* Marcadores azuis para cada localização */}
//         {localizacoes.map((localizacao, index) => (
//           <Marker
//             key={index}
//             coordinate={{
//               latitude: localizacao.latitude,
//               longitude: localizacao.longitude,
//             }}
//             pinColor="blue"
//             onPress={() => exibirMensagem(localizacao)}
//           />
//         ))}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   texto: {
//     fontSize: 18,
//     textAlign: "center",
//     marginTop: 20,
//     color: "#004A99",
//   },
// });

// export default ListarRotasPulseiras;

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { obterCercas } from "@/components/Cercas/storage/cercaStorage";

const ListarRotasPulseiras = () => {
  const { pulseiraId, cercaId } = useLocalSearchParams();
  const [localizacoes, setLocalizacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cerca, setCerca] = useState(null);

  // Carrega as localizações salvas e os dados da cerca
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carrega as localizações
        const chaveLocalizacoes = `localizacoes_${cercaId}`;
        const localizacoesSalvas = await AsyncStorage.getItem(
          chaveLocalizacoes
        );
        if (localizacoesSalvas) {
          setLocalizacoes(JSON.parse(localizacoesSalvas));
        }

        // Carrega os dados da cerca
        // const chaveCercas = "cercas";
        // const cercasSalvas = await AsyncStorage.getItem(chaveCercas);
        // if (cercasSalvas) {
        //   const cercas = JSON.parse(cercasSalvas);
        //   const cercaEncontrada = cercas.find((c) => c.id === cercaId);
        //   if (cercaEncontrada) {
        //     setCerca(cercaEncontrada);
        //   }
        // }
        // const chaveCercas = "cercas";
        const cercasSalvas = await obterCercas();
        if (cercasSalvas) {
          // const cercas = JSON.parse(cercasSalvas);
          const cercaEncontrada = cercasSalvas.find((c) => c.id === cercaId);
          if (cercaEncontrada) {
            setCerca(cercaEncontrada);
            console.log("Dados da cerca carregados:", cercaEncontrada); // Verifique no console
          } else {
            console.log("Cerca não encontrada para o ID:", cercaId);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [cercaId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#004A99" />
      </View>
    );
  }

  if (localizacoes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Nenhuma localização encontrada.</Text>
      </View>
    );
  }

  // Calcula a região inicial do mapa com base nas localizações
  const coordenadasIniciais = {
    latitude: localizacoes[0].latitude,
    longitude: localizacoes[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Função para exibir a mensagem ao clicar no marcador
  const exibirMensagem = (localizacao) => {
    // if (!cerca) return;

    // const hora = new Date(localizacao.timestamp).toLocaleTimeString([], {
    //   hour: "2-digit",
    //   minute: "2-digit",
    // });

    if (!cerca) {
      console.log("Dados da cerca não disponíveis.");
      Alert.alert("Erro", "Dados da cerca não foram carregados.");
      return;
    }

    if (!localizacao.timestamp) {
      console.log("Horário não disponível.");
      Alert.alert("Erro", "Horário da localização não foi registrado.");
      return;
    }

    const hora = new Date(localizacao.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    console.log("Exibindo mensagem:", { cerca: cerca.nome, hora });

    Alert.alert(
      "Localização",
      `A criança "${cerca.nome}" esteve aqui às ${hora}.`
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={coordenadasIniciais}
        mapType="hybrid"
      >
        {/* Desenha a rota percorrida */}
        <Polyline
          coordinates={localizacoes}
          strokeColor="#FF0000" // Cor da linha
          strokeWidth={3} // Espessura da linha
        />

        {/* Marcadores azuis para cada localização */}
        {localizacoes.map((localizacao, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: localizacao.latitude,
              longitude: localizacao.longitude,
            }}
            pinColor="blue"
            onPress={() => {
              console.log("Marcador clicado:", localizacao);
              exibirMensagem(localizacao);
            }}
            //  console.log("Marcador clicado:", localizacao);
            // exibirMensagem(localizacao)}
          />
        ))}

        {/* Marca o ponto inicial */}
        <Marker
          coordinate={{
            latitude: localizacoes[0].latitude,
            longitude: localizacoes[0].longitude,
          }}
          title="Início"
          pinColor="green"
        />

        {/* Marca o ponto final */}
        <Marker
          coordinate={{
            latitude: localizacoes[localizacoes.length - 1].latitude,
            longitude: localizacoes[localizacoes.length - 1].longitude,
          }}
          title="Fim"
          pinColor="red"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  texto: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#004A99",
  },
});

export default ListarRotasPulseiras;
