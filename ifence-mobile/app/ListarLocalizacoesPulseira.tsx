// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useLocalSearchParams } from 'expo-router';

// const ListarLocalizacoesPulseira = ({ route }) => {
//   // const { pulseiraId } = route.params; // Recebe o ID da pulseira como parâmetro
//   const { pulseiraId } = useLocalSearchParams();
//   const [localizacoes, setLocalizacoes] = useState([]);

//   useEffect(() => {
//     const carregarLocalizacoes = async () => {
//       // const chave = `localizacoes_${pulseiraId}`;
//       const chave = `${pulseiraId}`;
//       const localizacoesSalvas = await AsyncStorage.getItem(chave);
//       console.log("Carregando localizações para pulseira:", pulseiraId);
//       console.log("Localizações carregadas:", localizacoesSalvas);
//       if (localizacoesSalvas) {
//         setLocalizacoes(JSON.parse(localizacoesSalvas));
//       }
//     };
//     carregarLocalizacoes();
//   }, [pulseiraId]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.titulo}>Histórico de Localizações da Pulseira</Text>
//       <ScrollView>
//         {localizacoes.map((loc, index) => (
//           <View key={index} style={styles.localizacaoItem}>
//             <Text style={styles.texto}>Latitude: {loc.latitude.toFixed(5)}</Text>
//             <Text style={styles.texto}>Longitude: {loc.longitude.toFixed(5)}</Text>
//             <Text style={styles.texto}>Data: {new Date(loc.timestamp).toLocaleString()}</Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   titulo: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   localizacaoItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   texto: {
//     fontSize: 16,
//   },
// });

// export default ListarLocalizacoesPulseira;

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

const ListarLocalizacoesPulseira = () => {
  // const { pulseiraId } = useLocalSearchParams();
  const [localizacoes, setLocalizacoes] = useState([]);

  // useEffect(() => {
  //   const carregarLocalizacoes = async () => {
  //     const chave = `localizacoes_${pulseiraId}`;
  //     const localizacoesSalvas = await AsyncStorage.getItem(chave);
  //     console.log("Carregando localizações para pulseira:", pulseiraId);
  //     console.log("Localizações carregadas:", localizacoesSalvas);
  //     if (localizacoesSalvas) {
  //       setLocalizacoes(JSON.parse(localizacoesSalvas));
  //     } else {
  //       console.log("Nenhuma localização encontrada para a pulseira:", pulseiraId);
  //     }
  //   };
  //   carregarLocalizacoes();
  // }, [pulseiraId]);

  const { pulseiraId, cercaId } = useLocalSearchParams();
  // const { pulseiraId, cercaId } = useLocalSearchParams();
  console.log("Recebido pulseiraId:", pulseiraId, "e cercaId:", cercaId);

  useEffect(() => {
    const carregarLocalizacoes = async () => {
      const chave = `localizacoes_${cercaId}`; // Usa o ID da cerca para criar a chave
      const localizacoesSalvas = await AsyncStorage.getItem(chave);
      console.log("Carregando localizações para pulseira:", pulseiraId);
      console.log("Localizações carregadas:", localizacoesSalvas);
      if (localizacoesSalvas) {
        setLocalizacoes(JSON.parse(localizacoesSalvas));
      } else {
        console.log(
          "Nenhuma localização encontrada para a pulseira:",
          pulseiraId
        );
      }
    };
    carregarLocalizacoes();
  }, [pulseiraId, cercaId]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico de Localizações da Pulseira</Text>
      <ScrollView>
        {localizacoes.map((loc, index) => (
          <View key={index} style={styles.localizacaoItem}>
            <Text style={styles.texto}>
              Latitude: {loc.latitude.toFixed(5)}
            </Text>
            <Text style={styles.texto}>
              Longitude: {loc.longitude.toFixed(5)}
            </Text>
            <Text style={styles.texto}>
              Data: {new Date(loc.timestamp).toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  titulo: {
    fontSize: 24,
    color: "#004A99",
    fontWeight: "bold",
    marginBottom: 20,
  },
  localizacaoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  texto: {
    fontSize: 16,
  },
});

export default ListarLocalizacoesPulseira;
