import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getUserCredentials } from "@/storage/userStorage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const HeaderHomeUser = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      const credentials = await getUserCredentials();
      if (credentials) {
        setUsername(credentials.username);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = async () => {
    router.replace("/");
  };

  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Ionicons name="person-circle-outline" size={24} color="#FFFFFF" />
        <Text style={styles.headerText}>Olá, {username}</Text>
      </View>
      <TouchableOpacity  style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  //   safeArea: {
  //     backgroundColor: "#FFFFFF",
  //   },
  header: {
    flexDirection: "row",
    // marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#003F88",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logoutBtn: {
    // padding: 10
  }
});

export default HeaderHomeUser;
