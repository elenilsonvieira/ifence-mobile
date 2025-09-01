import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useCercas, type Cerca } from '../hooks/useCercas';
import { CercaModal } from '../components/CercaModal';
import CercaTable from '../components/CercaTable';
import { spacing, moderateScale } from '../../../utils/responsive';

const CercasPages: React.FC = () => {
  const { cercas, loading, addCerca, updateCerca, deleteCerca } = useCercas();
  const [modalVisible, setModalVisible] = useState(false);
  type ModalCercaData = {
    nome: string;
    latitude: string;
    longitude: string;
    raio: string;
    horarioInicio: string;
    horarioFim: string;
  };
  const [cercaEditando, setCercaEditando] = useState<ModalCercaData | null>(null);

  const handleSalvar = (dados: {
    nome: string;
    latitude: string;
    longitude: string;
    raio: string;
    horarioInicio: string;
    horarioFim: string;
  }) => {
    if (cercaEditando) {
      // Encontrar a cerca original pelo nome/coords se necessário; aqui assumimos que o ID está na lista
      const alvo = cercas.find((c) => c.nome === cercaEditando.nome && c.latitude === cercaEditando.latitude && c.longitude === cercaEditando.longitude);
      if (alvo) {
        updateCerca(alvo.id, dados);
      }
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
        <ActivityIndicator size="large" style={{ marginTop: spacing(2) }} />
      ) : (
        <CercaTable
          cercas={cercas}
          onEdit={(cerca: Cerca) => {
            setCercaEditando({
              nome: cerca.nome,
              latitude: cerca.latitude,
              longitude: cerca.longitude,
              raio: String(cerca.raio),
              horarioInicio: cerca.horarioInicio,
              horarioFim: cerca.horarioFim,
            });
            setModalVisible(true);
          }}
          onDelete={(id) => deleteCerca(id)}
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
    padding: spacing(2),
    backgroundColor: '#fff',
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: spacing(2),
  },
});

export default CercasPages;
