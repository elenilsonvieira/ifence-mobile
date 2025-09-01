import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated, Dimensions, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Link } from "expo-router";
import type { Href } from "expo-router";
import HeaderHomeUser from "@/components/HeaderHomeUser";
import { hasUnread } from "../../storage/notificationsStorage";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import { spacing, moderateScale, verticalScale } from "../../utils/responsive";
import ModalFeedback from "@/components/ModalFeedback";

const SCREEN_WIDTH = Dimensions.get('window').width;

const FEEDBACKS_ROUTE = "/(tabs)/Feedbacks" as unknown as Href;
// Imagens temáticas (principal e fallback)
const THEME_IMAGE = require("../../assets/images/Crianças.jpg");
const FALLBACK_IMAGE = require("../../assets/images/pai-filho.png");

const Home = () => {
  const colors = useDaltonicColors();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [notifUnread, setNotifUnread] = React.useState(false);
  const translateX = React.useRef(new Animated.Value(-SCREEN_WIDTH * 0.7)).current;
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(translateX, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };
  const closeMenu = () => {
    Animated.timing(translateX, { toValue: -SCREEN_WIDTH * 0.7, duration: 200, useNativeDriver: true }).start(() => setMenuOpen(false));
  };
  return (
    <>
  <HeaderHomeUser onOpenMenu={openMenu} />
      <View style={[styles.container, { backgroundColor: colors.background }] }>
        <View style={styles.boxButtons}>
          <Link href={"/(tabs)/ListarCercas"} asChild>
            <TouchableOpacity style={[styles.btnBoxButtons, { backgroundColor: "#003F88" }] }>
              <Ionicons name="map-outline" size={32} color="#FFFFFF" style={styles.iconBtn} />
              <Text style={[styles.textBtnBoxButtons, { color: "#FFFFFF" }]}>Adicionar Cerca</Text>
            </TouchableOpacity>
          </Link>

          <Link href={"/(tabs)/AdicionarPulseiraScreen"} asChild>
            <TouchableOpacity style={[styles.btnBoxButtons, { backgroundColor: "#003F88" }] }>
              <Ionicons name="watch-outline" size={32} color="#FFFFFF" style={styles.iconBtn} />
              <Text style={[styles.textBtnBoxButtons, { color: "#FFFFFF" }]}>Adicionar Pulseira</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.heroImageWrapper}>
          <Image
            source={imgError ? FALLBACK_IMAGE : THEME_IMAGE}
            style={styles.heroImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
            accessibilityLabel="Ilustração temática de segurança familiar do IFence"
          />
        </View>

        {/* Marca do app: ícone pai-filho + IFence, centralizada no espaço restante */}
        <View style={styles.brandArea}>
          <View style={styles.brandBadge}>
            <Image
              source={require("../../assets/images/pai-filho.png")}
              style={styles.brandIcon}
              resizeMode="contain"
              accessibilityLabel="Ícone pai-filho do IFence"
            />
          </View>
          <Text style={styles.brandText}>IFence</Text>
        </View>
      </View>

      {/* Overlay */}
      {menuOpen && (
        <Pressable style={styles.overlay} onPress={closeMenu} testID="menu-overlay" />
      )}
      {/* Drawer */}
      {menuOpen && (
        <Animated.View style={[styles.drawer, { transform: [{ translateX }] }] }>
          <Text style={styles.drawerTitle}>Menu</Text>
          {/* Notificações */}
          <Link href={"/Screens/Notifications"} asChild>
            <TouchableOpacity style={styles.drawerItem} onPress={closeMenu}>
              <View style={{ position: 'relative' }}>
                <Ionicons name="notifications-outline" size={20} color="#003F88" />
                {notifUnread && (
                  <View style={styles.badge} />
                )}
              </View>
              <Text style={styles.drawerItemText}>Notificações</Text>
            </TouchableOpacity>
          </Link>
          <Link href={"/(tabs)/Alarme"} asChild>
            <TouchableOpacity style={styles.drawerItem} onPress={closeMenu}>
              <Ionicons name="eye-outline" size={20} color="#003F88" />
              <Text style={styles.drawerItemText}>Monitoramento</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { setFeedbackOpen(true); }}>
            <Ionicons name="help-circle-outline" size={20} color="#003F88" />
            <Text style={styles.drawerItemText}>Ajuda / Feedback</Text>
          </TouchableOpacity>
          <Link href={FEEDBACKS_ROUTE} asChild>
            <TouchableOpacity style={styles.drawerItem} onPress={closeMenu}>
              <Ionicons name="list-outline" size={20} color="#003F88" />
              <Text style={styles.drawerItemText}>Feedbacks Salvos</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      )}

      {/* Modal de Feedback */}
      {feedbackOpen && (
        <ModalFeedback visible={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  padding: spacing(2),
    // backgroundColor: "#FFFFFF", // agora controlado pelo hook
  },
  boxButtons: {
    flexDirection: "row",
  marginTop: spacing(4),
    justifyContent: "center",
  gap: spacing(1),
  },
  textBtnBoxButtons: {
    // color: "#FFFFFF", // agora controlado pelo hook
  fontSize: moderateScale(15),
    textAlign: "center",
  },
  btnBoxButtons: {
    backgroundColor: "#003F88", // Alterado para azul
  padding: spacing(1),
  borderRadius: moderateScale(4),
    alignItems: "center",
  width: moderateScale(140),
    justifyContent: "center", // Centralizar ícones
  },
  iconBtn: {
  marginBottom: spacing(0.5),
    alignSelf: "center", // Centralizar ícones
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.7,
    backgroundColor: '#fff',
    paddingTop: spacing(4),
    paddingHorizontal: spacing(2),
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  drawerTitle: {
    fontWeight: 'bold',
    fontSize: moderateScale(18),
    marginBottom: spacing(2),
    color: '#003F88',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
    paddingVertical: spacing(1),
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    width: 10,
    height: 10,
    borderRadius: 9999,
    backgroundColor: '#E11D48',
  },
  drawerItemText: {
    fontSize: moderateScale(16),
    color: '#003F88',
  },
  heroImageWrapper: {
    alignSelf: 'center',
    marginTop: spacing(4),
    width: '80%',
    height: verticalScale(180),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    backgroundColor: '#e6eef8',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  brandArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing(2),
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  brandBadge: {
  backgroundColor: '#003F88',
  width: verticalScale(80),
  height: verticalScale(80),
  borderRadius: 9999,
  alignItems: 'center',
  justifyContent: 'center',
  // sombra leve
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 2,
  },
  brandIcon: {
    width: verticalScale(56),
    height: verticalScale(56),
  },
  brandText: {
  color: '#003F88',
    fontWeight: 'bold',
    fontSize: moderateScale(26),
  marginTop: spacing(1),
  },
});

export default Home;
