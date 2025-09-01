import AsyncStorage from '@react-native-async-storage/async-storage';

export type Feedback = {
  id: string;
  nome?: string;
  contato?: string;
  mensagem: string;
  criadoEm: string; // ISO string
  pendente?: boolean; // indica se precisa ser sincronizado com o backend
  categoria?: 'critica' | 'recomendacoes';
  scheduledAt?: string; // ISO: quando tentar enviar (ex.: agora + 10s)
  serverId?: string; // id gerado no backend quando sincronizado
};

export const FEEDBACKS_STORAGE_KEY = '@feedbacks';

export async function getFeedbacks(): Promise<Feedback[]> {
  const raw = await AsyncStorage.getItem(FEEDBACKS_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Feedback[];
    // Basic guard to ensure structure
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addFeedback(
  data: { nome?: string; contato?: string; mensagem: string; pendente?: boolean; categoria?: 'critica' | 'recomendacoes'; scheduledAt?: string }
): Promise<Feedback> {
  const novo: Feedback = {
    id: Date.now().toString(),
    nome: (data.nome || '').trim() || undefined,
    contato: (data.contato || '').trim() || undefined,
    mensagem: data.mensagem.trim(),
    criadoEm: new Date().toISOString(),
    pendente: data.pendente === true ? true : undefined,
    categoria: data.categoria,
    scheduledAt: data.scheduledAt,
  };
  const lista = await getFeedbacks();
  lista.push(novo);
  await AsyncStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(lista));
  return novo;
}

export async function removeFeedback(id: string): Promise<void> {
  const lista = await getFeedbacks();
  const filtrada = lista.filter((f) => String(f.id) !== String(id));
  await AsyncStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(filtrada));
}

export async function clearFeedbacks(): Promise<void> {
  await AsyncStorage.removeItem(FEEDBACKS_STORAGE_KEY);
}

export async function getPendingFeedbacks(): Promise<Feedback[]> {
  const todos = await getFeedbacks();
  return todos.filter((f) => f.pendente);
}

export async function markFeedbackAsSynced(id: string, serverId?: string): Promise<void> {
  const lista = await getFeedbacks();
  const atualizada = lista.map((f) => {
    if (String(f.id) === String(id)) {
      return { ...f, pendente: undefined, scheduledAt: undefined, serverId };
    }
    return f;
  });
  await AsyncStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(atualizada));
}
