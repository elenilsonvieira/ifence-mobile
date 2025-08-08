import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Pulseira } from '../hooks/usePulseiras';

interface PulseiraTableProps {
  pulseiras: Pulseira[];
  onEdit: (pulseira: Pulseira) => void;
  onDelete: (id: number) => void;
}

export default function PulseiraTable({ pulseiras, onEdit, onDelete }: PulseiraTableProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={pulseiras}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.identificador}>{item.identificador}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
                <Text style={styles.actionText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma pulseira cadastrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    justifyContent: 'space-between',
  },
  info: {
    flex: 2,
  },
  nome: {
    fontSize: 16,
    color: '#003F88',
    fontWeight: 'bold',
  },
  identificador: {
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    backgroundColor: '#FFD600',
    borderRadius: 5,
    padding: 8,
    marginRight: 5,
  },
  deleteBtn: {
    backgroundColor: '#D7263D',
    borderRadius: 5,
    padding: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});
