export const options = {
  headerShown: false,
};
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import Header from "@/components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { authApi, setAuthToken, initAuthTokenFromStorage } from "@/utils/api";
import { spacing, moderateScale } from "../../utils/responsive";

function EditarUsuarioScreen() {
  const colors = useDaltonicColors();
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Busca o usuário autenticado no backend (tenta /api e raiz)
        let data: any;
        try {
          const res = await api.get('/users/user');
          data = res.data;
        } catch (e) {
          const res2 = await authApi.get('/users/user');
          data = res2.data;
        }
  const u: any = data || {};
  setUserId(typeof u.id === 'number' ? u.id : u.id ? Number(u.id) : null);
  setName(u.name ?? u.username ?? "");
  setEmail(u.email ?? u.username ?? (await AsyncStorage.getItem("currentUser")) ?? "");
      } catch (e) {
        // fallback: carrega do storage local
        const savedUsername = await AsyncStorage.getItem("currentUser");
        setEmail(savedUsername ?? "");
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
  await initAuthTokenFromStorage();
      // Atualiza somente os campos fornecidos; senha é opcional
      const body: any = { id: userId ?? undefined, name, email, username: email };
      if (password) body.password = password;
      try {
        await api.put('/users', body);
      } catch (e: any) {
        try {
          await authApi.put('/users', body);
        } catch (e2: any) {
          if (userId) {
            try {
              await api.put(`/users/${userId}` as any, body);
            } catch (e3: any) {
              await authApi.put(`/users/${userId}` as any, body);
            }
          } else {
            throw e2;
          }
        }
      }
      // Atualiza exibição com retorno do backend
      try {
        const r1 = await api.get('/users/user');
        const u: any = r1?.data ?? {};
        const display = u?.name ?? u?.username ?? u?.email ?? name ?? email ?? '';
        await AsyncStorage.setItem('currentUser', String(display));
      } catch {
        try {
          const r2 = await authApi.get('/users/user');
          const u2: any = r2?.data ?? {};
          const display2 = u2?.name ?? u2?.username ?? u2?.email ?? name ?? email ?? '';
          await AsyncStorage.setItem('currentUser', String(display2));
        } catch {
          await AsyncStorage.setItem('currentUser', name || email || '');
        }
      }
      if (password) await AsyncStorage.setItem("currentUserPassword", password);
      Alert.alert("Sucesso", "Dados atualizados!");
      // Atualiza alias local (name -> email) para permitir login por nome no mesmo device
      try {
        const raw = await AsyncStorage.getItem('loginAliases');
        const map = raw ? JSON.parse(raw) : {};
        map[String(name || email)] = String(email);
        await AsyncStorage.setItem('loginAliases', JSON.stringify(map));
      } catch {}
    } catch (e: any) {
      const msg = e?.response?.data ? String(e.response.data) : e?.message;
      Alert.alert("Erro", msg || "Falha ao atualizar usuário");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
  await initAuthTokenFromStorage();
      if (!userId) throw new Error('Usuário inválido');
        // Tenta deletar usuário atual em diferentes rotas suportadas pelo backend
        let deleted = false;
        const attempts = [
          async () => { await api.delete('/users/user'); deleted = true; },
          async () => { await authApi.delete('/users/user'); deleted = true; },
          async () => { await api.delete('/users/me'); deleted = true; },
          async () => { await authApi.delete('/users/me'); deleted = true; },
          async () => { await api.delete('/user'); deleted = true; },
          async () => { await authApi.delete('/user'); deleted = true; },
          async () => { await api.delete('/me'); deleted = true; },
          async () => { await authApi.delete('/me'); deleted = true; },
          async () => { await api.delete('/users'); deleted = true; },
          async () => { await authApi.delete('/users'); deleted = true; },
          async () => { await api.delete(`/users/${userId}`); deleted = true; },
          async () => { await authApi.delete(`/users/${userId}`); deleted = true; },
          async () => { await api.delete(`/user/${userId}`); deleted = true; },
          async () => { await authApi.delete(`/user/${userId}`); deleted = true; },
        ];
        for (const run of attempts) {
          try {
            if (!deleted) await run();
          } catch (err: any) {
            const st = err?.response?.status;
            if (st && st >= 500) throw err; // não insistir em erros 5xx
            // continua tentando outras rotas em 404/401/403
          }
          if (deleted) break;
        }
        if (!deleted) throw new Error('Endpoint de exclusão de usuário não encontrado (404)');
        // Limpa sessão e aliases locais
      await AsyncStorage.removeItem("currentUser");
      await AsyncStorage.removeItem("currentUserPassword");
        try {
          const raw = await AsyncStorage.getItem('loginAliases');
          if (raw) {
            const map = JSON.parse(raw) as Record<string, string>;
            // remove entradas que apontam para este email e a chave do nome atual
            const newMap: Record<string, string> = {};
            Object.entries(map).forEach(([k, v]) => {
              if (k !== (name || '') && v !== (email || '')) newMap[k] = v;
            });
            await AsyncStorage.setItem('loginAliases', JSON.stringify(newMap));
          }
        } catch {}
      await setAuthToken(null);
      router.replace("/");
    } catch (e: any) {
      const msg = e?.response?.data ? String(e.response.data) : e?.message;
      Alert.alert("Erro", msg || "Falha ao excluir conta");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />
      <View style={{ flex: 1, padding: spacing(2) }}>
        <Text style={[styles.title, { color: colors.title }]}>Editar Credenciais</Text>
        <Text style={[styles.label, { color: colors.title }]}>Nome de usuário</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.title, borderColor: colors.border }]}
          placeholder="Digite seu nome de usuário"
          placeholderTextColor={colors.subtitle}
          value={name}
          onChangeText={setName}
        />
        <Text style={[styles.label, { color: colors.title }]}>E-mail</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.title, borderColor: colors.border }]}
          placeholder="Digite seu e-mail"
          placeholderTextColor={colors.subtitle}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={[styles.label, { color: colors.title }]}>Nova senha</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.title, borderColor: colors.border }]}
          placeholder="Digite a nova senha"
          placeholderTextColor={colors.subtitle}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.button, opacity: saving ? 0.7 : 1 }]} onPress={handleSave} disabled={saving}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>{saving ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.border }]} onPress={() => router.replace("/(tabs)/Home") }>
          <Text style={[styles.buttonText, { color: colors.title }]}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: '#D7263D', opacity: deleting ? 0.7 : 1 }]}
          onPress={() => {
            Alert.alert('Excluir conta', 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Excluir', style: 'destructive', onPress: handleDelete },
            ]);
          }}
          disabled={deleting}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>{deleting ? 'Excluindo...' : 'Excluir Conta'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
  fontSize: moderateScale(24),
    fontWeight: "bold",
  marginBottom: spacing(2),
    textAlign: "center",
  },
  label: {
  fontSize: moderateScale(14),
  marginBottom: spacing(0.5),
  },
  input: {
    borderRadius: 5,
  padding: spacing(1),
  marginBottom: spacing(1.25),
  fontSize: moderateScale(14),
    borderWidth: 1,
  },
  button: {
    borderRadius: 5,
  padding: spacing(1.5),
    alignItems: "center",
  marginTop: spacing(2),
  },
  buttonText: {
  fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  cancelButton: {
    borderRadius: 5,
  padding: spacing(1.5),
    alignItems: "center",
  marginTop: spacing(1),
  },
  deleteButton: {
    borderRadius: 5,
  padding: spacing(1.5),
    alignItems: "center",
  marginTop: spacing(1),
  },
});

export default EditarUsuarioScreen;
