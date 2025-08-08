import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { daltonicColors, defaultColors } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useResponsiveDimensions } from "../hooks/useResponsiveDimensions";

export default function TelaInicial() {
  const router = useRouter();
  const { width, height } = useResponsiveDimensions();
  const [daltonicMode, setDaltonicMode] = useState(false);
  const colors = daltonicMode ? daltonicColors : defaultColors;

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('daltonicMode');
        if (value === 'true') setDaltonicMode(true);
      } catch (e) {}
    })();
  }, []);

  const toggleDaltonicMode = async () => {
    try {
      setDaltonicMode((prev) => {
        AsyncStorage.setItem('daltonicMode', (!prev).toString());
        return !prev;
      });
    } catch (e) {}
  };

  const isTablet = width > 600;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { backgroundColor: colors.header }] }>
        <Image source={require("../assets/images/pai-filho.png")} style={styles.image1} accessibilityLabel="Imagem de pai e filho"/>
        <Text style={[styles.headerTitle, { color: colors.title }]}>IFence</Text>
        <TouchableOpacity
          style={{ position: 'absolute', right: 20, top: 40, zIndex: 10 }}
          accessibilityLabel={daltonicMode ? "Desativar modo daltônico" : "Ativar modo daltônico"}
          onPress={toggleDaltonicMode}
        >
          <Ionicons name="eye" size={28} color={daltonicMode ? colors.button : colors.title} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingHorizontal: isTablet ? 40 : 20 }}
      >
        <Text style={[styles.title, { color: colors.title }]}>IFence</Text>
        <Text style={[styles.subtitle, { color: colors.subtitle }]}>Um app feito para garantir a segurança dos pequenos</Text>

        <Text style={[styles.sectionTitle, { color: colors.title }]}>O que é o IFence?</Text>
        <Text style={[styles.infoBox, { backgroundColor: colors.infoBox, color: colors.infoText, borderColor: colors.border }]} accessibilityLabel="Descrição do IFence">
          O IFence é um aplicativo que tem o propósito de monitorar crianças em ambientes abertos.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.title }]}>Para quem é destinado o uso do IFence?</Text>
        <Text style={[styles.infoBox, { backgroundColor: colors.infoBox, color: colors.infoText, borderColor: colors.border }]} accessibilityLabel="Público-alvo do IFence">
          O IFence é destinado para pais ou responsáveis que desejam monitorar crianças que estejam sob sua tutela.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.title }]}>Guia de uso:</Text>
        <Text style={[styles.guideText, { color: colors.infoText }]} accessibilityLabel="Guia de uso do IFence">
          1 - <Ionicons name="eye" size={18} color={colors.button} /> <Text style={{ color: colors.infoText }}>Modo de acessibilidade para daltônicos!</Text>{"\n"}
          2 - <Text style={{ color: colors.infoText }}>Crie uma conta para poder utilizar o IFence.</Text>{"\n"}
          3 - <Text style={{ color: colors.infoText }}>Com uma conta já criada, você pode utilizar os recursos do IFence.</Text>{"\n"}
          4 - <Text style={{ color: colors.infoText }}>Crie uma pulseira com o nome da criança que está sob sua tutela.</Text>{"\n"}
          5 - <Text style={{ color: colors.infoText }}>Crie uma cerca, adicionando a localização e o raio que essa criança pode circular.</Text>{"\n"}
          6 - <Text style={{ color: colors.infoText }}>Atribua a criança à cerca.</Text>
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.title }]}>Acesse sua conta ou crie uma nova:</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.button, marginBottom: 10, borderColor: colors.border, borderWidth: 2 }]}
            onPress={() => router.push("/auth/LoginScreen")}
            accessibilityLabel="Botão para fazer login"
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Fazer Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.button, marginBottom: 10, borderColor: colors.border, borderWidth: 2 }]}
            onPress={() => router.push("/auth/CadastroScreen")}
            accessibilityLabel="Botão para criar conta"
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Criar Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { 
      flex: 1
    },
    header: { 
      flexDirection: "row", 
      justifyContent: "space-between", 
      alignItems: "center",
      padding: 20 
    },
    headerTitle: { 
      fontSize: 20, 
      fontWeight: "bold", 
      right:"75%", 
      padding:5, 
      bottom:-15 
    }, 
    loginButton: { 
      padding: 5 
    },
    loginText: { 
      fontSize: 16 
    },
    title: { 
      fontSize: 24, 
      fontWeight: "bold", 
      textAlign: "center", 
      marginVertical: 10
    },
    subtitle: { 
      fontSize: 16, 
      textAlign: "center"
    },
    image: { 
      marginTop: 50, 
      left: 40, 
      padding: 160
    },
    image1: {
      marginRight: 30,
      width: 30,
      height: 30,
      right: 20,
      top: 10,
      resizeMode: 'contain',
    },
    imageText: { 
      fontSize: 20, 
      fontWeight: "bold", 
      textAlign: "center", 
      bottom:210, 
      left:45 
    },
    sectionTitle: { 
      fontSize: 18, 
      fontWeight: "bold", 
      marginTop: 15, 
      left: 10
    },
    infoBox: {
      padding: 10,
      borderRadius: 5,
      marginTop: 5,
      left: 8,
      width: 395,
      borderWidth: 2
    },
    
    guideText: { 
      fontSize: 14, 
      marginTop: 5, 
      left:10 
    },
    buttonContainer: { 
      flexDirection: "row", 
      justifyContent: "center", 
      marginTop: 30 
    },
    button: { 
      padding: 10, 
      borderRadius: 5, 
      marginHorizontal: 10, 
      bottom:20 
    },
    buttonText: { 
      fontSize: 16, 
      textAlign: "center", 
      padding:5 
    },
  });
