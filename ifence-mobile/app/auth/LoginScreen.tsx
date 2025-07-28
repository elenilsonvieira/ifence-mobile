import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { showToast } from "@/utils/toastUtils";

import { findUserCredentials } from "../../storage/userStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";


function LoginScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [modalErroVisible, setModalErroVisible] = useState(false);

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
          showToast("success", "Sucesso", "Login realizado com sucesso!");
          router.replace("/(tabs)/Home");
        } else {
          setModalErroVisible(true);
        }
      } catch (error) {
        setModalErroVisible(true);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.container}>
        <Link href={"/"} asChild>
          <TouchableOpacity style={styles.btnBackPage}>
            <Image source={require("@/assets/images/ArrowBack.png")} />
          </TouchableOpacity>
        </Link>
        <Text style={styles.titulo}>Login</Text>
        <View style={styles.form}>
          <Text style={styles.label} accessibilityLabel="Nome de usuário obrigatório">Nome de usuário*</Text>
          <TextInput
            style={[
              styles.input,
              userNameError ? styles.inputError : userName ? styles.inputSuccess : null,
            ]}
            placeholder="O nome de usuário deve ser informado"
            placeholderTextColor="#999"
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
            <Text style={styles.errorText} accessibilityLiveRegion="polite">{userNameError}</Text>
          ) : null}

          <Text style={styles.label} accessibilityLabel="Senha obrigatória">Senha*</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                passwordError ? styles.inputError : password ? styles.inputSuccess : null,
              ]}
              placeholder="******"
              placeholderTextColor="#999"
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
                color="#003F88"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={styles.errorText} accessibilityLiveRegion="polite">{passwordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            !userName ||
            !password ||
            userNameError !== "" ||
            passwordError !== ""
              ? styles.buttonDisabled
              : null,
          ]}
          onPress={handleLogin}
          disabled={
            !userName ||
            !password ||
            userNameError !== "" ||
            passwordError !== ""
          }
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/CadastroScreen")}> 
          <Text style={styles.createAccountText}>
            Não tem uma conta ainda? Criar Conta
          </Text>
        </TouchableOpacity>

        {/* Modal de erro removido. Todo feedback de erro é feito via showToast. */}
      </View>

      <Modal
        visible={modalErroVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalErroVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="close-circle" size={60} color="#DA1E37" style={{ marginBottom: 10 }} />
            <Text style={styles.modalTitleError}>Erro ao logar</Text>
            <Text style={styles.modalMessage}>Usuário ou senha inválidos. Verifique suas credenciais e tente novamente.</Text>
            <TouchableOpacity
              style={styles.modalButtonError}
              onPress={() => setModalErroVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitleError: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#DA1E37',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalButtonError: {
    backgroundColor: '#DA1E37',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnBackPage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    marginLeft: 0,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  titulo: {
    fontSize: 28,
    color: "#003F88",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#003F88",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    fontSize: 16,
    color: "#003F88",
    borderWidth: 1,
    borderColor: "#003F88",
  },
  inputError: {
    borderColor: "red",
  },
  inputSuccess: {
    borderColor: "green",
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
    backgroundColor: "#003F88",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  createAccountText: {
    color: "#003F88",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  // Modal customizado removido
});

export default LoginScreen;
