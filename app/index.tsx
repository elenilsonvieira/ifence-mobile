import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { daltonicColors, defaultColors } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useResponsiveDimensions } from "../hooks/useResponsiveDimensions";
import { spacing, moderateScale } from "../utils/responsive";

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
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require("../assets/images/pai-filho.png")} style={{ width: moderateScale(30), height: moderateScale(30), resizeMode: 'contain', marginRight: spacing(1) }} accessibilityLabel="Imagem de pai e filho"/>
          <Text style={[styles.headerTitle, { color: colors.title }]}>IFence</Text>
        </View>
        <TouchableOpacity
          style={{ padding: spacing(1) }}
          accessibilityLabel={daltonicMode ? "Desativar modo daltônico" : "Ativar modo daltônico"}
          onPress={toggleDaltonicMode}
        >
          <Ionicons name="eye" size={moderateScale(24)} color={daltonicMode ? colors.button : colors.title} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingHorizontal: isTablet ? spacing(4) : spacing(2) }}
      >
        <Text style={[styles.title, { color: colors.title }]}
          >IFence
        </Text>
        <Text style={[styles.subtitle, { color: colors.subtitle }]}>Um app feito para garantir a segurança dos pequenos</Text>

        <Text style={[styles.sectionTitle, { color: colors.title }]}>O que é o IFence?</Text>
        <Text style={[styles.infoBox, { backgroundColor: colors.infoBox, color: colors.infoText, borderColor: colors.border, width: '100%' }]} accessibilityLabel="Descrição do IFence">
          O IFence é um aplicativo que tem o propósito de monitorar crianças em ambientes abertos.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.title }]}>Para quem é destinado o uso do IFence?</Text>
        <Text style={[styles.infoBox, { backgroundColor: colors.infoBox, color: colors.infoText, borderColor: colors.border, width: '100%' }]} accessibilityLabel="Público-alvo do IFence">
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
            style={[styles.button, { backgroundColor: colors.button, marginBottom: spacing(1), borderColor: colors.border, borderWidth: 2 }]}
            onPress={() => router.push("/auth/LoginScreen")}
            accessibilityLabel="Botão para fazer login"
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Fazer Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.button, marginBottom: spacing(1), borderColor: colors.border, borderWidth: 2 }]}
            onPress={() => router.push("/auth/CadastroScreen")}
            accessibilityLabel="Botão para criar conta"
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Criar Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1
    },
    header: { 
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing(2),
      paddingVertical: spacing(2)
     },
     headerTitle: { 
      fontSize: moderateScale(20),
      fontWeight: "bold",
     }, 
    loginButton: { 
      padding: spacing(1) 
    },
    loginText: { 
      fontSize: moderateScale(14) 
    },
    title: { 
      fontSize: moderateScale(22), 
      fontWeight: "bold", 
      textAlign: "center", 
  marginVertical: spacing(1.25)
    },
    subtitle: { 
      fontSize: moderateScale(14), 
      textAlign: "center"
    },
    image: { 
      marginTop: spacing(4), 
  left: spacing(5), 
      padding: spacing(4)
    },
    image1: {
      marginRight: spacing(2),
      width: moderateScale(26),
      height: moderateScale(26),
  right: spacing(2.5),
      top: spacing(1),
      resizeMode: 'contain',
    },
    imageText: { 
      fontSize: moderateScale(16), 
      fontWeight: "bold", 
      textAlign: "center", 
  bottom: spacing(26), 
  left: spacing(5.5) 
    },
    sectionTitle: { fontSize: moderateScale(18), fontWeight: "bold", marginTop: spacing(2) },
     infoBox: {
      padding: spacing(2),
  borderRadius: moderateScale(5),
      marginTop: spacing(1),
      borderWidth: 2,
     },
    guideText: { fontSize: moderateScale(14), marginTop: spacing(1) },
     buttonContainer: { 
       flexDirection: "row", 
       justifyContent: "center", 
       marginTop: spacing(3)
     },
     button: { 
      padding: spacing(2), 
  borderRadius: moderateScale(5), 
  marginHorizontal: spacing(1.25), 
     },
     buttonText: { fontSize: moderateScale(16), textAlign: "center", padding: spacing(1) },
  });
