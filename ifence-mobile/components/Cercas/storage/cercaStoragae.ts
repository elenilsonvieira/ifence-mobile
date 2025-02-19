import AsyncStorage from "@react-native-async-storage/async-storage";

const CERCAS_STORAGE = "@cercas";

export const salvarCerca = async (cerca: {
  nome: string;
  latitude: string;
  longitude: string;
  raio: number;
}) => {
  try {
    const cercasSalvas = await AsyncStorage.getItem(CERCAS_STORAGE);
    const cercas = cercasSalvas ? JSON.parse(cercasSalvas) : [];
    cercas.push(cerca);
    await AsyncStorage.setItem(CERCAS_STORAGE, JSON.stringify(cercas));
  } catch (error) {
    console.error("Erro ao salvar cerca:", error);
  }
};

export const obterCercas = async () => {
    try {
      const cercasSalvas = await AsyncStorage.getItem(CERCAS_STORAGE);
      return cercasSalvas ? JSON.parse(cercasSalvas) : [];
    } catch (error) {
      console.error("Erro ao obter cercas:", error);
      return [];
    }
};