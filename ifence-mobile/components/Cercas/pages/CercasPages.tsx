import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useCercas } from '../hooks/useCercas';
import { CercaModal } from '../components/CercaModal';
import { CercaTable } from '../components/CercaTable';

const CercasPages: React.FC = () => {
  const { cercas, loading, addCerca, updateCerca, deleteCerca } = useCercas();
  const [modalVisible, setModalVisible] = useState(false);
  const [cercaEditando, setCercaEditando] = useState<any>(null);

  const handleSalvar = (dados: { nome: string; coordenadas: string }) => {
    if (cercaEditando) {
      updateCerca(cercaEditando.id, dados);
    } else {
      addCerca(dados);
    }
  };

  const abrirModalNova = () => {
    setCercaEditando(null);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Cercas</Text>
      <Button title="Nova Cerca" onPress={abrirModalNova} />
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <CercaTable
          cercas={cercas}
          onEdit={(cerca) => {
            setCercaEditando(cerca);
            setModalVisible(true);
          }}
          onDelete={deleteCerca}
        />
      )}
      <CercaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSalvar}
        cercaParaEditar={cercaEditando}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default CercasPages;
