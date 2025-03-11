import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUserCredentials = async (username: string, password: string) => {
    try {
      await AsyncStorage.setItem(
        "userCredentials",
        JSON.stringify({ username, password })
      );
      console.log("Credenciais salvas com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao salvar credenciais:", error);
      return false;
    }
};

export const getUserCredentials = async () => {
    try {
      const credentials = await AsyncStorage.getItem("userCredentials");
      if (credentials) {
        return JSON.parse(credentials);
      }
      return null;
    } catch (error) {
      console.error("Erro ao recuperar credenciais:", error);
      return null;
    }
};