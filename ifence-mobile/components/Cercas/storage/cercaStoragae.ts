import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";

const CERCAS_STORAGE = "@cercas";

// export const salvarCerca = async (cerca: {
//   nome: string;
//   latitude: string;
//   longitude: string;
//   raio: number;
// }) => {
//   try {
//     const cercasSalvas = await AsyncStorage.getItem(CERCAS_STORAGE);
//     const cercas = cercasSalvas ? JSON.parse(cercasSalvas) : [];

//     // Garante que cada cerca tem um ID
//     const novaCerca = { id: uuidv4(), ...cerca };

//     cercas.push(novaCerca);
//     await AsyncStorage.setItem(CERCAS_STORAGE, JSON.stringify(cercas));

//     console.log("Cerca salva com ID:", novaCerca.id); // Log para confirmar ID salvo
//   } catch (error) {
//     console.error("Erro ao salvar cerca:", error);
//   }
// };

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { v4 as uuidv4 } from "uuid";

// const CERCAS_STORAGE = "cercas";

export const salvarCerca = async (cerca: {
  id?: string; // ID é opcional
  nome: string;
  latitude: string;
  longitude: string;
  raio: number;
}) => {
  try {
    const cercasSalvas = await AsyncStorage.getItem(CERCAS_STORAGE);
    const cercas = cercasSalvas ? JSON.parse(cercasSalvas) : [];

    if (cerca.id) {
      // Se a cerca já tem um ID, atualize a cerca existente
      const index = cercas.findIndex((c) => c.id === cerca.id);
      if (index !== -1) {
        cercas[index] = cerca; // Atualiza a cerca existente
      } else {
        console.warn("Cerca não encontrada para atualização. Criando uma nova.");
        cercas.push({ id: uuidv4(), ...cerca }); // Cria uma nova cerca se o ID não for encontrado
      }
    } else {
      // Se a cerca não tem um ID, crie uma nova cerca
      const novaCerca = { id: uuidv4(), ...cerca };
      cercas.push(novaCerca);
    }

    await AsyncStorage.setItem(CERCAS_STORAGE, JSON.stringify(cercas));
    console.log("Cerca salva com sucesso:", cerca);
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

export const removerCercaStorage = async (id: string) => {
  try {
    const cercasSalvas = await AsyncStorage.getItem(CERCAS_STORAGE);
    const cercas = cercasSalvas ? JSON.parse(cercasSalvas) : [];
    
    const novasCercas = cercas.filter((cerca) => cerca.id !== id);
    
    await AsyncStorage.setItem(CERCAS_STORAGE, JSON.stringify(novasCercas));
  } catch (error) {
    console.error("Erro ao remover cerca:", error);
  }
};

export const limparCercas =  async () => {
  try {
    await AsyncStorage.removeItem(CERCAS_STORAGE);
  } catch (error) {
    console.error("erro ao excluir", error);
  }
}