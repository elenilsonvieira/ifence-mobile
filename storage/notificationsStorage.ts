import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationItem = {
  id: string; // `${braceletId}-${timestamp}`
  braceletName: string;
  fenceName?: string;
  timestamp: string; // ISO
  message: string; // Ex.: "Pulseira 'X' fora da cerca às 12:34"
  read?: boolean;
};

const KEY = '@notifications';

export async function getNotifications(): Promise<NotificationItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function addNotification(n: NotificationItem) {
  const list = await getNotifications();
  list.unshift(n);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function markAllRead() {
  const list = await getNotifications();
  const upd = list.map((n) => ({ ...n, read: true }));
  await AsyncStorage.setItem(KEY, JSON.stringify(upd));
}

export async function clearNotifications() {
  await AsyncStorage.removeItem(KEY);
}

export async function hasUnread(): Promise<boolean> {
  const list = await getNotifications();
  return list.some((n) => !n.read);
}
