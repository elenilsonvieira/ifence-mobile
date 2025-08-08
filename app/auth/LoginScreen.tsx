import React, { useState } from "react";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { findUserCredentials } from "../../storage/userStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

function LoginScreen() {
  const colors = useDaltonicColors();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateFields = () => {
    let isValid = true;
    if (userName.trim() === "") {
      setUserNameError("O nome de usuário deve ser informado");
      isValid = false;
    } else if (userName.length < 4) {
      setUserNameError("O nome de usuário deve ter pelo menos 4 caracteres");
      isValid = false;
    } else {
      setUserNameError("");
    }
    if (password.trim() === "") {
      setPasswordError("A senha precisa ser informada");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      isValid = false;
    } else {
      setPasswordError("");
    }
    return isValid;
  };

  const handleLogin = async () => {
    if (validateFields()) {
      try {
        const user = await findUserCredentials(userName, password);
        if (user) {
          await AsyncStorage.setItem("currentUser", userName);
          router.replace("/(tabs)/Home");
        } else {
          setErrorMessage("Nome de usuário ou senha incorretos, ou nenhuma conta cadastrada.");
          setShowErrorModal(true);
        }
      } catch (error) {
        setErrorMessage("Ocorreu um erro ao tentar fazer login. Tente novamente.");
        setShowErrorModal(true);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />
      <View style={styles.container}>
        <Link href={"/"} asChild>
          <TouchableOpacity style={styles.btnBackPage}>
            <Image source={require("@/assets/images/ArrowBack.png")} />
          </TouchableOpacity>
        </Link>
        <Text style={[styles.titulo, { color: colors.title }]}>Login</Text>
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.title }]} accessibilityLabel="Nome de usuário obrigatório">Nome de usuário*</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.background, color: colors.title, borderColor: colors.border },
              userNameError ? { borderColor: colors.button } : userName ? { borderColor: colors.buttonText } : null,
            ]}
            placeholder="O nome de usuário deve ser informado"
            placeholderTextColor={colors.subtitle}
            value={userName}
            onChangeText={(text) => {
              setUserName(text);
              if (text.trim() === "") {
                setUserNameError("O nome de usuário deve ser informado");
              } else if (text.length < 4) {
                setUserNameError("O nome de usuário deve ter pelo menos 4 caracteres");
              } else {
                setUserNameError("");
              }
            }}
            onBlur={() => validateFields()}
            accessibilityLabel="Campo para digitar o nome de usuário"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
          {userNameError ? (
            <Text style={[styles.errorText, { color: colors.button }]} accessibilityLiveRegion="polite">{userNameError}</Text>
          ) : null}

          <Text style={[styles.label, { color: colors.title }]} accessibilityLabel="Senha obrigatória">Senha*</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                { backgroundColor: colors.background, color: colors.title, borderColor: colors.border },
                passwordError ? { borderColor: colors.button } : password ? { borderColor: colors.buttonText } : null,
              ]}
              placeholder="******"
              placeholderTextColor={colors.subtitle}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (text.trim() === "") {
                  setPasswordError("A senha precisa ser informada");
                } else if (text.length < 6) {
                  setPasswordError("A senha deve ter pelo menos 6 caracteres");
                } else {
                  setPasswordError("");
                }
              }}
              onBlur={() => validateFields()}
              accessibilityLabel="Campo para digitar a senha"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color={colors.title}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={[styles.errorText, { color: colors.button }]} accessibilityLiveRegion="polite">{passwordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: (!userName || !password || userNameError !== "" || passwordError !== "") ? colors.border : colors.button },
          ]}
          onPress={handleLogin}
          disabled={
            !userName ||
            !password ||
            userNameError !== "" ||
            passwordError !== ""
          }
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/CadastroScreen")}> 
          <Text style={[styles.createAccountText, { color: colors.title }]}>Não tem uma conta ainda? Criar Conta</Text>
        </TouchableOpacity>

        {/* Modal de erro customizado */}
        <Modal
          visible={showErrorModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowErrorModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }] }>
              <Ionicons name="close-circle" size={60} color={colors.button} style={{ marginBottom: 10 }} />
              <Text style={[styles.modalTitle, { color: colors.button }]}>Erro</Text>
              <Text style={[styles.modalMessage, { color: colors.title }]}>{errorMessage}</Text>
              <Pressable
                style={({ pressed }) => [styles.modalButton, { backgroundColor: colors.button }, pressed && { opacity: 0.7 }]}
                onPress={() => setShowErrorModal(false)}
                accessibilityLabel="Fechar mensagem de erro"
              >
                <Text style={[styles.modalButtonText, { color: colors.buttonText }]}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnBackPage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    marginLeft: 0,
  },
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: "#FFFFFF", // agora controlado pelo hook
  },
  titulo: {
    fontSize: 28,
    // color: "#003F88", // agora controlado pelo hook
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    // color: "#003F88", // agora controlado pelo hook
    marginBottom: 5,
  },
  input: {
    // backgroundColor: "#f0f0f0", // agora controlado pelo hook
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    fontSize: 16,
    // color: "#003F88", // agora controlado pelo hook
    borderWidth: 1,
    // borderColor: "#003F88", // agora controlado pelo hook
  },
  inputError: {
    // borderColor: "red", // agora controlado pelo hook
  },
  inputSuccess: {
    // borderColor: "green", // agora controlado pelo hook
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    padding: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    // backgroundColor: "#003F88", // agora controlado pelo hook
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    // backgroundColor: "#ccc", // agora controlado pelo hook
  },
  buttonText: {
    // color: "#fff", // agora controlado pelo hook
    fontSize: 18,
    fontWeight: "bold",
  },
  createAccountText: {
    // color: "#003F88", // agora controlado pelo hook
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  // Modal customizado
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    // backgroundColor: '#fff', // agora controlado pelo hook
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 280,
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    // color: '#D7263D', // agora controlado pelo hook
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    // color: '#333', // agora controlado pelo hook
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    // backgroundColor: '#D7263D', // agora controlado pelo hook
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 5,
  },
  modalButtonText: {
    // color: '#fff', // agora controlado pelo hook
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
