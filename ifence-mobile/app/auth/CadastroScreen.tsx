import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Modal } from "react-native";
import Header from "@/components/Header";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { saveUserCredentials } from "@/storage/userStorage";

const CadastroScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateFields = () => {
    let isValid = true;

    if (username.trim() === "") {
      setUsernameError("O nome de usuário deve ser informado");
      isValid = false;
    } else if (username.length < 4) {
      setUsernameError("O nome de usuário deve ter pelo menos 4 caracteres");
      isValid = false;
    } else {
      setUsernameError("");
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

  const handleCriarConta = async () => {
    if (validateFields()) {
      const result = await saveUserCredentials(username, password);
      if (result.success) {
        setShowSuccess(true);
      } else if (result.message === "Nome de usuário já cadastrado.") {
        Alert.alert("Erro", "Nome de usuário já cadastrado. Escolha outro.");
      } else {
        Alert.alert("Erro", "Não foi possível criar a conta. Tente novamente.");
      }
    }
  };

  return (
    <>
      <Header />
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={60} color="#4BB543" style={{ marginBottom: 10 }} />
            <Text style={styles.modalTitle}>Sucesso!</Text>
            <Text style={styles.modalMessage}>Conta criada com sucesso!</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccess(false);
                router.replace("/auth/LoginScreen");
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
      <Link href={"/"} asChild>
        <TouchableOpacity style={styles.btnBackPage}>
          <Image source={require("@/assets/images/ArrowBack.png")} />
        </TouchableOpacity>
      </Link>
        <Text style={styles.titulo}>Criar conta</Text>

        <View style={styles.form}>
          <Text style={styles.label} accessibilityLabel="Nome de usuário obrigatório">Nome de usuário*</Text>
          <TextInput
            style={[
              styles.input,
              usernameError ? styles.inputError : username ? styles.inputSuccess : null,
            ]}
            placeholder="O nome de usuário deve ser informado"
            placeholderTextColor="#999"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (text.trim() === "") {
                setUsernameError("O nome de usuário deve ser informado");
              } else if (text.length < 4) {
                setUsernameError("O nome de usuário deve ter pelo menos 4 caracteres");
              } else {
                setUsernameError("");
              }
            }}
            onBlur={() => validateFields()}
            accessibilityLabel="Campo para digitar o nome de usuário"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
          {usernameError ? (
            <Text style={styles.errorText} accessibilityLiveRegion="polite">{usernameError}</Text>
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
            !username ||
            !password ||
            usernameError !== "" ||
            passwordError !== ""
              ? styles.buttonDisabled
              : null,
          ]}
          onPress={handleCriarConta}
          disabled={
            !username ||
            !password ||
            usernameError !== "" ||
            passwordError !== ""
          }
        >
          <Text style={styles.buttonText}>Criar Conta</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

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
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4BB543',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4BB543',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  btnBackPage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    marginLeft: 0,
  },
  titulo: {
    fontSize: 28,
    color: "#003F88",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#003F88",
    marginBottom: 5,
  },
  form: {
    marginBottom: 30,
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
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
});

export default CadastroScreen;
