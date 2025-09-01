import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { authApi, setAuthToken } from "@/utils/api";
import Header from "@/components/Header";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import { findUserCredentials } from "../../storage/userStorage";
import { spacing, moderateScale } from "../../utils/responsive";

type AuthenticationResponse = { token: string; user?: any };

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
      setUserNameError("Informe e-mail ou nome de usuário");
      isValid = false;
    } else if (userName.length < 4) {
      setUserNameError("Mínimo de 4 caracteres");
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

  async function loginBackend(identifier: string, password: string, deviceToken?: string) {
    try {
      // Resolve alias local: se usuario digitou nome (não email), tenta mapear para email salvo
      let ident = identifier;
      const looksEmail = /@/.test(identifier);
      if (!looksEmail) {
        try {
          const raw = await AsyncStorage.getItem('loginAliases');
          if (raw) {
            const map = JSON.parse(raw) as Record<string, string>;
            if (map[identifier]) ident = map[identifier];
          }
        } catch {}
      }
      // 1) Tenta com { username }
      try {
        const res = await authApi.post<AuthenticationResponse>('/api/login', {
          username: ident,
          password,
          deviceToken: deviceToken ?? null,
        });
        const token = res.data?.token;
        if (token) {
          await setAuthToken(token);
          return { success: true };
        }
      } catch (err1: any) {
        const st1 = err1?.response?.status;
        if (st1 === 404) {
          // fallback sem prefixo
          const res2 = await authApi.post<AuthenticationResponse>('/login', {
            username: ident,
            password,
            deviceToken: deviceToken ?? null,
          });
          const token = res2.data?.token;
          if (token) {
            await setAuthToken(token);
            return { success: true };
          }
        }
        // 2) Se falhou com 400/401, tenta com { email } quando parecer email
        if (st1 === 400 || st1 === 401) {
          try {
            const res3 = await authApi.post<AuthenticationResponse>('/api/login', {
              email: looksEmail ? ident : undefined,
              username: looksEmail ? undefined : ident,
              password,
              deviceToken: deviceToken ?? null,
            });
            const token = res3.data?.token;
            if (token) {
              await setAuthToken(token);
              return { success: true };
            }
          } catch (err3: any) {
            const st3 = err3?.response?.status;
            if (st3 === 404) {
              const res4 = await authApi.post<AuthenticationResponse>('/login', {
                email: looksEmail ? ident : undefined,
                username: looksEmail ? undefined : ident,
                password,
                deviceToken: deviceToken ?? null,
              });
              const token = res4.data?.token;
              if (token) {
                await setAuthToken(token);
                return { success: true };
              }
            }
          }
        }
        // Se chegou aqui, propaga o erro original
        throw err1;
      }
      return { success: false, message: 'Credenciais inválidas.' };
    } catch (e: any) {
      console.error('Erro no login:', e?.response?.data || e?.message);
      return { success: false, message: 'Falha ao autenticar.' };
    }
  }

  const handleLogin = async () => {
    if (!validateFields()) return;
    const result = await loginBackend(userName, password);
    if (result.success) {
      // guarda credenciais para re-login silencioso se necessário
      await AsyncStorage.setItem("currentUser", userName);
      await AsyncStorage.setItem("currentUserPassword", password);
      // tenta obter nome de exibição do backend
      try {
        const r1 = await api.get('/users/user');
        const u: any = r1?.data ?? {};
        const display = u?.name ?? u?.username ?? u?.email ?? userName;
        await AsyncStorage.setItem('currentUser', String(display));
      } catch {
        try {
          const r2 = await authApi.get('/users/user');
          const u2: any = r2?.data ?? {};
          const display2 = u2?.name ?? u2?.username ?? u2?.email ?? userName;
          await AsyncStorage.setItem('currentUser', String(display2));
        } catch {}
      }
      router.replace("/(tabs)/Home");
    } else {
      setErrorMessage(result.message || "Falha ao autenticar.");
      setShowErrorModal(true);
    }
  };

  const disabled = !userName || !password || userNameError !== "" || passwordError !== "";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />
      <View style={styles.container}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.btnBackPage} accessibilityRole="button" accessibilityLabel="Voltar">
            <Image source={require("@/assets/images/ArrowBack.png")} />
          </TouchableOpacity>
        </Link>

        <Text style={[styles.titulo, { color: colors.title }]}>Login</Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.title }]} accessibilityLabel="E-mail ou nome de usuário obrigatório">
            E-mail ou Nome de usuário*
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.background, color: colors.title, borderColor: colors.border },
              userNameError ? { borderColor: colors.button } : userName ? { borderColor: colors.buttonText } : null,
            ]}
            placeholder="Digite seu e-mail ou nome de usuário"
            placeholderTextColor={colors.subtitle}
            value={userName}
            onChangeText={(text) => {
              setUserName(text);
              if (text.trim() === "") {
                setUserNameError("Informe e-mail ou nome de usuário");
              } else if (text.length < 4) {
                setUserNameError("Mínimo de 4 caracteres");
              } else {
                setUserNameError("");
              }
            }}
            onBlur={validateFields}
            accessibilityLabel="Campo para digitar e-mail ou nome de usuário"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
          {userNameError ? (
            <Text style={[styles.errorText, { color: colors.button }]} accessibilityLiveRegion="polite">
              {userNameError}
            </Text>
          ) : null}

          <Text style={[styles.label, { color: colors.title }]} accessibilityLabel="Senha obrigatória">
            Senha*
          </Text>
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
              onBlur={validateFields}
              accessibilityLabel="Campo para digitar a senha"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword((v) => !v)}
              accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={moderateScale(20)} color={colors.title} />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={[styles.errorText, { color: colors.button }]} accessibilityLiveRegion="polite">
              {passwordError}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: disabled ? colors.border : colors.button }]}
          onPress={handleLogin}
          disabled={disabled}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/CadastroScreen")}>
          <Text style={[styles.createAccountText, { color: colors.title }]}>Não tem uma conta ainda? Criar Conta</Text>
        </TouchableOpacity>

        <Modal visible={showErrorModal} transparent animationType="fade" onRequestClose={() => setShowErrorModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <Ionicons name="close-circle" size={moderateScale(50)} color={colors.button} style={{ marginBottom: spacing(1) }} />
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
  container: {
    flex: 1,
    padding: spacing(2),
  },
  btnBackPage: {
    alignSelf: "flex-start",
    marginBottom: spacing(1),
  },
  titulo: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing(2),
  },
  form: {
    marginBottom: spacing(2),
  },
  label: {
    fontSize: moderateScale(14),
    marginBottom: spacing(0.5),
  },
  input: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    padding: spacing(1.5),
    marginBottom: spacing(1),
    fontSize: moderateScale(14),
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: spacing(4),
  },
  eyeIcon: {
    position: "absolute",
    right: spacing(1),
    top: spacing(1),
    padding: spacing(0.75),
  },
  errorText: {
    fontSize: moderateScale(12),
    marginBottom: spacing(1),
  },
  button: {
    borderRadius: moderateScale(8),
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    alignItems: "center",
    marginTop: spacing(1),
    marginBottom: spacing(1),
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  createAccountText: {
    fontSize: moderateScale(14),
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: spacing(1),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing(2),
  },
  modalContent: {
    borderRadius: moderateScale(12),
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(2),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 280,
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: spacing(0.5),
    textAlign: "center",
  },
  modalMessage: {
    fontSize: moderateScale(14),
    marginBottom: spacing(1.5),
    textAlign: "center",
  },
  modalButton: {
    borderRadius: moderateScale(8),
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(2),
    alignItems: "center",
    marginTop: spacing(0.5),
  },
  modalButtonText: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },
});

export default LoginScreen;
