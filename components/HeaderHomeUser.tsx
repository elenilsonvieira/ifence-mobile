import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { spacing, moderateScale } from "../utils/responsive";
import { setAuthToken } from "@/utils/api";
import { hasUnread } from "../storage/notificationsStorage";

type Props = {
  onOpenMenu?: () => void;
};

const HeaderHomeUser: React.FC<Props> = ({ onOpenMenu }) => {
  const [username, setUsername] = useState("");
  const [unread, setUnread] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      const currentUser = await AsyncStorage.getItem("currentUser");
      if (currentUser) {
        setUsername(currentUser);
      } else {
        setUsername("");
      }
    };
    fetchUsername();
  const checkUnread = async () => setUnread(await hasUnread());
  checkUnread();
  }, []);

  const handleLogout = async () => {
    await setAuthToken(null);
    await AsyncStorage.removeItem("currentUser");
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      {/* Esquerda: menu sanduíche */}
      <View style={styles.side}>
        <Pressable
          onPress={onOpenMenu}
          accessibilityLabel="Abrir menu"
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
        >
          <View style={{ position: 'relative' }}>
            <Ionicons name="menu" size={28} color="#FFFFFF" />
            {unread && <View style={styles.badge} />}
          </View>
        </Pressable>
      </View>

      {/* Centro: usuário */}
      <Pressable
        onPress={() => router.push("/Screens/EditarUsuario")}
        accessibilityLabel="Editar credenciais do usuário"
        style={styles.center}
      >
        <Ionicons name="person-circle-outline" size={22} color="#FFFFFF" />
        <Text style={styles.headerText} numberOfLines={1}>
          Olá, {username || 'Usuário'}
        </Text>
      </Pressable>

      {/* Direita: sair */}
      <View style={styles.side}>
        <Pressable
          onPress={handleLogout}
          accessibilityLabel="Sair da conta"
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
        >
          <View style={styles.logoutContent}>
            <Ionicons name="log-out-outline" size={26} color="#FFFFFF" />
            <Text style={styles.logoutText}>Sair</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003F88',
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.75),
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 9999,
    backgroundColor: '#E11D48',
  },
  side: {
    width: 48, // garante áreas laterais iguais para centralizar o centro
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(0.5),
  marginTop: spacing(2.1),
  },
  iconBtn: {
  padding: spacing(0.5),
  marginTop: spacing(2.5),
    borderRadius: 8,
  },
  headerText: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logoutContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: "#FFFFFF",
  fontSize: moderateScale(12),
    marginTop: spacing(0.25),
  },
  logoutBtnPressed: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 8,
  },
});

export default HeaderHomeUser;
