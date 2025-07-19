import { useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function TelaInicial() {
    const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require("@/assets/images/pai-filho.png")} style={styles.image1} accessibilityLabel="Imagem de pai e filho"/>
        <Text style={styles.headerTitle}>IFence</Text>
      </View>

      <Text style={styles.title}>IFence</Text>
      <Text style={styles.subtitle}>Um app feito para garantir a segurança dos pequenos</Text>

      <Text style={styles.sectionTitle}>O que é o IFence?</Text>
      <Text style={styles.infoBox} accessibilityLabel="Descrição do IFence">
        O IFence é um aplicativo que tem o propósito de monitorar crianças em ambientes abertos.
      </Text>

      <Text style={styles.sectionTitle}>Para quem é destinado o uso do IFence?</Text>
      <Text style={styles.infoBox} accessibilityLabel="Público-alvo do IFence">
        O IFence é destinado para pais ou responsáveis que desejam monitorar crianças que estejam sob sua tutela.
      </Text>

      <Text style={styles.sectionTitle}>Guia de uso:</Text>
      <Text style={styles.guideText} accessibilityLabel="Guia de uso do IFence">
        1 - Crie uma conta para poder utilizar o IFence.{"\n"}
        2 - Com uma conta já criada, você pode utilizar os recursos do IFence.{"\n"}
        3 - Crie uma pulseira com o nome da criança que está sob sua tutela.{"\n"}
        4 - Crie uma cerca, adicionando a localização e o raio que essa criança pode circular.{"\n"}
        5 - Atribua a criança à cerca.
      </Text>

      <Text style={styles.sectionTitle}>Acesse sua conta ou crie uma nova:</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#003F88', marginBottom: 10 }]}
          onPress={() => router.push("/auth/LoginScreen")}
          accessibilityLabel="Botão para fazer login"
        >
          <Text style={styles.buttonText}>Fazer Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#0078AE' }]}
          onPress={() => router.push("/auth/CadastroScreen")}
          accessibilityLabel="Botão para criar conta"
        >
          <Text style={styles.buttonText}>Criar Conta</Text>
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
