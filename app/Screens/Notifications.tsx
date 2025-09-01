import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NotificationItem, getNotifications, markAllRead, clearNotifications } from '../../storage/notificationsStorage';
import { spacing, moderateScale } from '../../utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const NotificationsScreen: React.FC = () => {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const load = useCallback(async () => {
    const list = await getNotifications();
    setItems(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
      // Marca como lidas ao entrar
      markAllRead();
    }, [load])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Notificações</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={async () => { await clearNotifications(); setItems([]); }}>
            <Ionicons name="trash-bin-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-outline" size={48} color="#A7B4D0" />
          <Text style={styles.emptyText}>Sem notificações.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: spacing(2) }}
          ItemSeparatorComponent={() => <View style={{ height: spacing(1) }} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.msg}>{item.message}</Text>
                {!item.read && <View style={styles.dot} />}
              </View>
              <Text style={styles.meta}>{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#003F88',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(4),
  },
  title: { color: '#FFFFFF', fontSize: moderateScale(18), fontWeight: 'bold' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: spacing(1.5),
    borderWidth: 1,
    borderColor: '#E3E8F0',
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  msg: { flex: 1, color: '#0F172A', fontSize: moderateScale(15) },
  meta: { marginTop: spacing(0.5), color: '#64748B', fontSize: moderateScale(12) },
  dot: { width: 10, height: 10, borderRadius: 9999, backgroundColor: '#E11D48', marginLeft: spacing(1) },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing(1) },
  emptyText: { color: '#64748B' },
});

export default NotificationsScreen;
