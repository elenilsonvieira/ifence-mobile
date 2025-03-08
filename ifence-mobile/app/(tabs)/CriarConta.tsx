import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Eye, EyeOff } from "lucide-react-native";

const CriarConta: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    showPassword: false,
  });
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const newErrors: { username?: string; email?: string; password?: string } = {};
    if (!formData.username) newErrors.username = "O nome de usuário deve ser informado";
    if (!formData.email) newErrors.email = "O e-mail deve ser informado";
    if (!formData.password) newErrors.password = "A senha deve ser informada";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const existingAccounts = await AsyncStorage.getItem("userAccounts");
      const accounts = existingAccounts ? JSON.parse(existingAccounts) : [];

      accounts.push({ username: formData.username, email: formData.email, password: formData.password });
      await AsyncStorage.setItem("userAccounts", JSON.stringify(accounts));

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      setFormData({ username: "", email: "", password: "", showPassword: false });
      setErrors({});
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome de usuário*</Text>
        <TextInput
          style={[styles.input, errors.username ? styles.inputError : styles.inputSuccess]}
          value={formData.username}
          onChangeText={(value) => handleChange("username", value)}
        />
      </View>
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-mail*</Text>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : styles.inputSuccess]}
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
          keyboardType="email-address"
        />
      </View>
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Senha*</Text>
        <View style={[styles.input, styles.passwordContainer, errors.password ? styles.inputError : styles.inputSuccess]}>
          <TextInput
            style={styles.passwordInput}
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry={!formData.showPassword}
          />
          <TouchableOpacity onPress={() => setFormData({ ...formData, showPassword: !formData.showPassword })}>
            {formData.showPassword ? <EyeOff /> : <Eye />}
          </TouchableOpacity>
        </View>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#003F88",
    marginBottom: 20,
    marginTop: -5,
  },
  inputContainer: {
    width: 250,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 41,
    borderWidth: 2,
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    borderColor: "#ccc",
    marginTop: -5,
  },
  inputError: {
    borderColor: "red",
    color: "#000",
  },
  inputSuccess: {
    borderColor: "green",
    color: "#000",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#669BBC",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 36,
    width: 156,
    height: 42,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CriarConta;