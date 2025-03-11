import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
// import Header from "@/components/Header";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { getUserCredentials } from "@/storage/userStorage";

const LoginScreen = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateFields = () => {
    let isValid = true;

    if (userName.trim() === "") {
      setUserNameError("O nome de usuário deve ser informado");
      isValid = false;
    } else {
      setUserNameError("");
    }

    if (password.trim() === "") {
      setPasswordError("A senha precisa ser informada");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (validateFields()) {
      try {
        // Recupera as credenciais salvas no AsyncStorage
        const credentials = await getUserCredentials();

        if (credentials) {
          // Verifica se as credenciais inseridas correspondem às salvas
          if (
            userName === credentials.username &&
            password === credentials.password
          ) {
            // Credenciais corretas: redireciona para a tela Home
            router.replace("/(tabs)/Home");
          } else {
            // Credenciais incorretas: exibe mensagem de erro
            Alert.alert("Erro", "Nome de usuário ou senha incorretos.");
          }
        } else {
          // Nenhuma credencial salva: exibe mensagem de erro
          Alert.alert(
            "Erro",
            "Nenhuma conta cadastrada. Crie uma conta primeiro."
          );
        }
      } catch (error) {
        console.error("Erro ao recuperar credenciais:", error);
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao tentar fazer login. Tente novamente."
        );
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
        <Text style={styles.titulo}>Login</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome de usuário*</Text>
          <TextInput
            style={[
              styles.input,
              userNameError
                ? styles.inputError
                : userName
                ? styles.inputSuccess
                : null,
            ]}
            placeholder="O nome de usuário deve ser informado"
            placeholderTextColor="#999"
            value={userName}
            onChangeText={(text) => {
              setUserName(text);
              if (text.trim() !== "") {
                setUserNameError("");
              }
            }}
            onBlur={() => validateFields()}
          />
          {userNameError ? (
            <Text style={styles.errorText}>{userNameError}</Text>
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
              placeholder="Digite sua senha"
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
});

export default LoginScreen;
