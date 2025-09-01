import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";

const CERCAS_STORAGE = "@cercas";

export type Cerca = {
  id: string;
  nome: string;
  latitude: string;
  longitude: string;
  raio: number;
  horarioInicio: string;
  horarioFim: string;
  pulseiraId: string | null;
};

export const salvarCerca = async (cerca: {
  id?: string; // ID é opcional
  nome: string;
  latitude: string;
  longitude: string;
  raio: number;
  horarioInicio: string; // Novo campo
  horarioFim: string; 
}) => {
  try {
  const cercasSalvas = await AsyncStorage.getItem(CERCAS_STORAGE);
  const cercas: Cerca[] = cercasSalvas ? JSON.parse(cercasSalvas) : [];

  const novaCerca: Cerca = {
      ...cerca,
      id: cerca.id || uuidv4(), // Gera um ID se não existir
      pulseiraId: null, 
    };

    if (cerca.id) {
  const index = cercas.findIndex((c: Cerca) => c.id === cerca.id);
      if (index !== -1) {
        cercas[index] = novaCerca; 
      } else {
        console.warn("Cerca não encontrada para atualização. Criando uma nova.");
        cercas.push(novaCerca); 
      }
    } else {
      cercas.push(novaCerca); 
    }

    await AsyncStorage.setItem(CERCAS_STORAGE, JSON.stringify(cercas));
    console.log("Cerca salva com sucesso:", novaCerca);
  } catch (error) {
    console.error("Erro ao salvar cerca:", error);
  }
};

export const obterCercas = async (): Promise<Cerca[]> => {
    try {
  const cercasSalvas = await AsyncStorage.getItem(CERCAS_STORAGE);
  return cercasSalvas ? (JSON.parse(cercasSalvas) as Cerca[]) : [];
    } catch (error) {
      console.error("Erro ao obter cercas:", error);
      return [];
    }
};

export const removerCercaStorage = async (id: string) => {
  try {
  const cercasSalvas = await AsyncStorage.getItem(CERCAS_STORAGE);
  const cercas: Cerca[] = cercasSalvas ? (JSON.parse(cercasSalvas) as Cerca[]) : [];
    
  const novasCercas = cercas.filter((cerca: Cerca) => cerca.id !== id);
    
    await AsyncStorage.setItem(CERCAS_STORAGE, JSON.stringify(novasCercas));
  } catch (error) {
    console.error("Erro ao remover cerca:", error);
  }
};

export const atribuirPulseiraACerca = async (cercaId: string, pulseiraId: string) => {
  try {
    // Obtém todas as cercas salvas
  const cercasSalvas = await AsyncStorage.getItem(CERCAS_STORAGE);
  const cercas: Cerca[] = cercasSalvas ? (JSON.parse(cercasSalvas) as Cerca[]) : [];

    // Encontra a cerca pelo ID
  const cercaIndex = cercas.findIndex((c: Cerca) => c.id === cercaId);
    if (cercaIndex !== -1) {
      // Atualiza o campo pulseiraId da cerca
      cercas[cercaIndex].pulseiraId = pulseiraId;

      // Salva as cercas atualizadas no AsyncStorage
      await AsyncStorage.setItem(CERCAS_STORAGE, JSON.stringify(cercas));
      console.log("Pulseira atribuída à cerca com sucesso:", cercas[cercaIndex]);
    } else {
      console.warn("Cerca não encontrada para atribuição de pulseira.");
    }
  } catch (error) {
    console.error("Erro ao atribuir pulseira à cerca:", error);
  }
};
