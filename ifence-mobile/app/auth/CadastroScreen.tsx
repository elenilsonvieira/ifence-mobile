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

  const validateFields = () => {
    let isValid = true;

    if (username.trim() === "") {
      setUsernameError("O nome de usuário deve ser informado");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (password.trim() === "") {
      setPasswordError("A senha precisa ser informada");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleCriarConta = async () => {
    if (validateFields()) {
      const success = await saveUserCredentials(username, password); 
      if (success) {
        Alert.alert("Sucesso", "Conta criada com sucesso!", [
          { text: "OK", onPress: () => router.replace("/auth/LoginScreen") },
        ]);
      } else {
        Alert.alert("Erro", "Não foi possível criar a conta. Tente novamente.");
      }
    }
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
      <Link href={"/"} asChild>
        <TouchableOpacity style={styles.btnBackPage}>
          <Image source={require("@/assets/images/ArrowBack.png")} />
        </TouchableOpacity>
      </Link>
        <Text style={styles.titulo}>Criar conta</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome de usuário*</Text>
          <TextInput
            style={[
              styles.input,
              usernameError
                ? styles.inputError
                : username
                ? styles.inputSuccess
                : null,
            ]}
            placeholder="O nome de usuário deve ser informado"
            placeholderTextColor="#999"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (text.trim() !== "") {
                setUsernameError("");
              }
            }}
            onBlur={() => validateFields()}
          />
          {usernameError ? (
            <Text style={styles.errorText}>{usernameError}</Text>
          ) : null}

          <Text style={styles.label}>Senha*</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                passwordError
                  ? styles.inputError
                  : password
                  ? styles.inputSuccess
                  : null,
              ]}
              placeholder="******"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (text.trim() !== "") {
                  setPasswordError("");
                }
              }}
              onBlur={() => validateFields()}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#003F88"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
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
