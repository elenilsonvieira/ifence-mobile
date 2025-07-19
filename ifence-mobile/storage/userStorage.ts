import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "userCredentialsList";

export const saveUserCredentials = async (username: string, password: string) => {
  try {
    // Recupera a lista atual de usuários
    const usersJson = await AsyncStorage.getItem(STORAGE_KEY);
    let users = usersJson ? JSON.parse(usersJson) : [];

    // Verifica se já existe usuário com o mesmo nome
    const userExists = users.some((u: any) => u.username === username);
    if (userExists) {
      return { success: false, message: "Nome de usuário já cadastrado." };
    }

    // Adiciona novo usuário
    users.push({ username, password });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar credenciais:", error);
    return { success: false, message: "Erro ao salvar credenciais." };
  }
};

// Busca usuário pelo nome e senha
export const findUserCredentials = async (username: string, password: string) => {
  try {
    const usersJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (!usersJson) return null;
    const users = JSON.parse(usersJson);
    return users.find((u: any) => u.username === username && u.password === password) || null;
  } catch (error) {
    console.error("Erro ao buscar credenciais:", error);
    return null;
  }
};