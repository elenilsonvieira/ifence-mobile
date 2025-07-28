import { useRouter } from "expo-router";
import React, { useState } from "react";
import { daltonicColors, defaultColors } from "@/constants/DaltonicColors";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function TelaInicial() {
  const router = useRouter();
  const [daltonicMode, setDaltonicMode] = useState(false);
  const colors = daltonicMode ? daltonicColors : defaultColors;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }] }>
      <View style={[styles.header, { backgroundColor: colors.header }] }>
        <Image source={require("@/assets/images/pai-filho.png")} style={styles.image1} accessibilityLabel="Imagem de pai e filho"/>
        <Text style={[styles.headerTitle, { color: colors.title }]}>IFence</Text>
        <TouchableOpacity
          style={{ position: 'absolute', right: 20, top: 20, zIndex: 10 }}
          accessibilityLabel="Ativar modo daltônico"
          onPress={() => setDaltonicMode((prev) => !prev)}
        >
          <Ionicons name="eye" size={28} color={daltonicMode ? colors.button : colors.title} />
        </TouchableOpacity>
      </View>

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
        1 - Crie uma conta para poder utilizar o IFence.{"\n"}
        2 - Com uma conta já criada, você pode utilizar os recursos do IFence.{"\n"}
        3 - Crie uma pulseira com o nome da criança que está sob sua tutela.{"\n"}
        4 - Crie uma cerca, adicionando a localização e o raio que essa criança pode circular.{"\n"}
        5 - Atribua a criança à cerca.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.title }]}>Acesse sua conta ou crie uma nova:</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.button, marginBottom: 10 }]}
          onPress={() => router.push("/auth/LoginScreen")}
          accessibilityLabel="Botão para fazer login"
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Fazer Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.button }]}
          onPress={() => router.push("/auth/CadastroScreen")}
          accessibilityLabel="Botão para criar conta"
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Criar Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: "#fff", 
    },
    header: { 
      flexDirection: "row", 
      justifyContent: "space-between", 
      alignItems: "center",
      backgroundColor: "#003F88", 
      padding: 20 
    },
    headerTitle: { 
      color: "#fff", 
      fontSize: 20, 
      fontWeight: "bold", 
      right:"76%", 
      padding:5, 
      bottom:-15 
    }, 
    loginButton: { 
      padding: 5 
    },
    loginText: { 
      color: "#fff", 
      fontSize: 16 
    },
    title: { 
      fontSize: 24, 
      fontWeight: "bold", 
      textAlign: "center", 
      marginVertical: 10, 
      color:"#003F88" 
    },
    subtitle: { 
      fontSize: 16, 
      textAlign: "center", 
      color: "#003366" 
    },
    image: { 
      marginTop: 50, 
      left: 40, 
      padding: 160
    },
    image1: {
      bottom:-13,
      right:5,
    },
    imageText: { 
      fontSize: 20, 
      fontWeight: "bold", 
      textAlign: "center", 
      color: "#003F88", 
      bottom:210, 
      left:45 
    },
    sectionTitle: { 
      fontSize: 18, 
      fontWeight: "bold", 
      marginTop: 15, 
      left: 10,
      color:"#003F88"
    },
    infoBox: { 
      backgroundColor: "#ADE8F466", 
      color: "#003F88",
      padding: 10, 
      borderRadius: 5, 
      marginTop: 5, 
      left: 8, 
      borderColor: "#003F88", 
      width:395,
      borderWidth: 2 
    },
    
    guideText: { 
      fontSize: 14, 
      color: "#003F88", 
      marginTop: 5, 
      left:10 
    },
    buttonContainer: { 
      flexDirection: "row", 
      justifyContent: "center", 
      marginTop: 30 
    },
    button: { 
      backgroundColor: "#003F88", 
      padding: 10, 
      borderRadius: 5, 
      marginHorizontal: 10, 
      bottom:20 
    },
    buttonText: { 
      color: "#fff", 
      fontSize: 16, 
      textAlign: "center", 
      padding:5 
    },
  });
