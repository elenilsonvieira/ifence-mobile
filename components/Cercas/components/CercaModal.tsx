import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface CercaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    nome: string;
    latitude: string;
    longitude: string;
    raio: string;
    horarioInicio: string;
    horarioFim: string;
  }) => void;
  cercaParaEditar?: {
    nome: string;
    latitude: string;
    longitude: string;
    raio: string;
    horarioInicio: string;
    horarioFim: string;
  } | null;
}


export const CercaModal: React.FC<CercaModalProps> = ({ visible, onClose, onSave, cercaParaEditar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    latitude: '',
    longitude: '',
    raio: '',
    horarioInicio: '',
    horarioFim: '',
  });
  const [params, setParams] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    if (cercaParaEditar) {
      setFormData({
        ...cercaParaEditar,
        raio: cercaParaEditar.raio ?? '',
      });
    } else {
      setFormData({
        nome: '',
        latitude: '',
        longitude: '',
        raio: '',
        horarioInicio: '',
        horarioFim: '',
      });
    }
  }, [cercaParaEditar]);

  // Atualiza latitude/longitude se vierem do mapa
  useEffect(() => {
    if (params.latitude && params.longitude) {
      setFormData((prev) => ({ ...prev, latitude: params.latitude, longitude: params.longitude }));
    }
  }, [params.latitude, params.longitude]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleGoHome = () => {
    onClose();
    router.push('/(tabs)/Home');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{cercaParaEditar ? 'Editar Cerca' : 'Nova Cerca'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={formData.nome}
            onChangeText={(text) => handleChange('nome', text)}
          />
          <TouchableOpacity
            style={[styles.input, { backgroundColor: '#003F88', alignItems: 'center' }]}
            onPress={() => {
              // Abre o mapa para selecionar local, passando o raio atual
              router.push({
                pathname: '/Screens/Map',
                params: { raio: formData.raio || '100', from: 'modal' },
              });
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Selecionar Local no Mapa</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>Latitude:</Text>
              <Text style={{ color: '#333' }}>{formData.latitude}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>Longitude:</Text>
              <Text style={{ color: '#333' }}>{formData.longitude}</Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Raio (metros)"
            value={formData.raio}
            onChangeText={(text) => handleChange('raio', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Horário de Início (HH:mm)"
            value={formData.horarioInicio}
            onChangeText={(text) => handleChange('horarioInicio', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Horário de Fim (HH:mm)"
            value={formData.horarioFim}
            onChangeText={(text) => handleChange('horarioFim', text)}
          />
          <View style={styles.buttonRow}>
            <Button title="Cancelar" onPress={handleCancel} color="#888" />
            <Button title="Salvar" onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
