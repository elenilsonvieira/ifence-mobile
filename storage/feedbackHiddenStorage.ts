import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@feedbacks_hidden_ids';

export async function getHiddenIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

export async function hideFeedback(id: string): Promise<void> {
  const ids = await getHiddenIds();
  if (!ids.includes(String(id))) ids.push(String(id));
  await AsyncStorage.setItem(KEY, JSON.stringify(ids));
}

export async function hideMany(idsToHide: string[]): Promise<void> {
  const current = await getHiddenIds();
  const set = new Set<string>(current);
  idsToHide.forEach((i) => set.add(String(i)));
  await AsyncStorage.setItem(KEY, JSON.stringify(Array.from(set)));
}

export async function clearHidden(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
