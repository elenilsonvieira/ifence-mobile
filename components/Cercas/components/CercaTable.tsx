

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

type Cerca = {
  id: string | number;
  nome: string;
  coordenadas?: string;
};

interface CercaTableProps {
  cercas: Cerca[];
  onEdit: (cerca: Cerca) => void;
  onDelete: (id: string | number) => void;
}

const CercaTable: React.FC<CercaTableProps> = ({ cercas, onEdit, onDelete }) => {
  return (
    <FlatList
      data={cercas}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.cellId}>
            <Text style={styles.idLabel}>ID:</Text>
            <Text style={styles.idValue} numberOfLines={8} ellipsizeMode="tail">{
              String(item.id).replace(/(.{8})/g, '$1\n')
            }</Text>
          </View>
          <Text style={styles.cellNome}>{item.nome}</Text>
          <View style={styles.cellCoord}>
            <Text style={styles.coordLabel}>Latitude:</Text>
            <Text style={styles.coordValue} numberOfLines={2}>{item.coordenadas ? item.coordenadas.split(',')[0] : ''}</Text>
            <Text style={styles.coordLabel}>Longitude:</Text>
            <Text style={styles.coordValue} numberOfLines={2}>{item.coordenadas ? item.coordenadas.split(',')[1] : ''}</Text>
          </View>
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
          <Text style={styles.headerCellId}>ID</Text>
          <Text style={styles.headerCellNome}>Nome</Text>
          <Text style={styles.headerCellCoord}>Coordenadas</Text>
          <Text style={styles.headerCellAcoes}>Ações</Text>
        </View>
      )}
    />
  );
};

export default CercaTable;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    padding: 8,
    alignItems: 'center',
  },
  headerCellId: {
    flex: 1.2,
    fontWeight: 'bold',
    minWidth: 60,
    maxWidth: 90,
  },
  headerCellNome: {
    flex: 1.2,
    fontWeight: 'bold',
    minWidth: 70,
    maxWidth: 120,
  },
  headerCellCoord: {
    flex: 1.5,
    fontWeight: 'bold',
    minWidth: 90,
    maxWidth: 140,
  },
  headerCellAcoes: {
    flex: 0.9,
    fontWeight: 'bold',
    minWidth: 80,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  cellId: {
    flex: 1.2,
    minWidth: 90,
    maxWidth: 180,
    marginRight: 2,
    flexDirection: 'column',
  },
  idLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  idValue: {
    fontSize: 13,
    color: '#222',
    flexWrap: 'wrap',
    maxWidth: 90,
    lineHeight: 16,
    textAlign: 'left',
  },
  cellNome: {
    flex: 1.2,
    minWidth: 70,
    maxWidth: 120,
    marginRight: 2,
    overflow: 'hidden',
  },
  cellCoord: {
    flex: 1.5,
    minWidth: 110,
    maxWidth: 200,
    marginRight: 2,
    flexDirection: 'column',
  },
  coordLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
  coordValue: {
    fontSize: 13,
    color: '#222',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    flex: 0.9,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  editBtn: {
    backgroundColor: '#ffc107',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
    minWidth: 54,
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    minWidth: 54,
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
