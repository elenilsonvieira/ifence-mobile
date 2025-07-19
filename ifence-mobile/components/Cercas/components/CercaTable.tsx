import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

interface Cerca {
  id: number;
  nome: string;
  coordenadas: string;
}

interface CercaTableProps {
  cercas: Cerca[];
  onEdit: (cerca: Cerca) => void;
  onDelete: (id: number) => void;
}

export const CercaTable: React.FC<CercaTableProps> = ({ cercas, onEdit, onDelete }) => {
  return (
    <FlatList
      data={cercas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.id}</Text>
          <Text style={styles.cell}>{item.nome}</Text>
          <Text style={styles.cell}>{item.coordenadas}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Text style={styles.headerCell}>ID</Text>
          <Text style={styles.headerCell}>Nome</Text>
          <Text style={styles.headerCell}>Coordenadas</Text>
          <Text style={styles.headerCell}>Ações</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    padding: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  editBtn: {
    backgroundColor: '#ffc107',
    padding: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    padding: 6,
    borderRadius: 4,
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
