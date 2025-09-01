import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, moderateScale } from '../../../utils/responsive';
import type { Cerca } from '../hooks/useCercas';

interface CercaTableProps {
  cercas: Cerca[];
  onEdit: (cerca: Cerca) => void;
  onDelete: (id: string) => void;
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
            <Text style={styles.coordValue} numberOfLines={2}>{item.latitude}</Text>
            <Text style={styles.coordLabel}>Longitude:</Text>
            <Text style={styles.coordValue} numberOfLines={2}>{item.longitude}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(String(item.id))}>
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
    padding: spacing(1),
    alignItems: 'center',
  },
  headerCellId: {
    flex: 1.2,
    fontWeight: 'bold',
    minWidth: 50,
  },
  headerCellNome: {
    flex: 1.2,
    fontWeight: 'bold',
    minWidth: 60,
  },
  headerCellCoord: {
    flex: 1.5,
    fontWeight: 'bold',
    minWidth: 80,
  },
  headerCellAcoes: {
    flex: 0.9,
    fontWeight: 'bold',
    minWidth: 80,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(0.5),
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  cellId: {
    flex: 1.2,
    minWidth: 70,
    marginRight: spacing(0.25),
    flexDirection: 'column',
  },
  idLabel: {
    fontWeight: 'bold',
    fontSize: moderateScale(12),
    color: '#333',
  },
  idValue: {
    fontSize: moderateScale(13),
    color: '#222',
    flexWrap: 'wrap',
    maxWidth: '100%',
    lineHeight: moderateScale(16),
    textAlign: 'left',
  },
  cellNome: {
    flex: 1.2,
    minWidth: 60,
    marginRight: spacing(0.25),
    overflow: 'hidden',
  },
  cellCoord: {
    flex: 1.5,
    minWidth: 90,
    marginRight: spacing(0.25),
    flexDirection: 'column',
  },
  coordLabel: {
    fontWeight: 'bold',
    fontSize: moderateScale(12),
    color: '#333',
    marginTop: spacing(0.25),
  },
  coordValue: {
    fontSize: moderateScale(13),
    color: '#222',
    marginBottom: spacing(0.25),
  },
  actions: {
    flexDirection: 'row',
    flex: 0.9,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing(0.5),
  },
  editBtn: {
    backgroundColor: '#ffc107',
    paddingVertical: spacing(0.75),
    paddingHorizontal: spacing(1.25),
    borderRadius: 4,
    marginRight: spacing(0.5),
    minWidth: 54,
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: spacing(0.75),
    paddingHorizontal: spacing(1.25),
    borderRadius: 4,
    minWidth: 54,
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
});
