import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface CercaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { nome: string; coordenadas: string }) => void;
  cercaParaEditar?: { nome: string; coordenadas: string } | null;
}

export const CercaModal: React.FC<CercaModalProps> = ({ visible, onClose, onSave, cercaParaEditar }) => {
  const [formData, setFormData] = useState({ nome: '', coordenadas: '' });

  useEffect(() => {
    if (cercaParaEditar) {
      setFormData(cercaParaEditar);
    } else {
      setFormData({ nome: '', coordenadas: '' });
    }
  }, [cercaParaEditar]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
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
          <TextInput
            style={styles.input}
            placeholder="Coordenadas"
            value={formData.coordenadas}
            onChangeText={(text) => handleChange('coordenadas', text)}
          />
          <View style={styles.buttonRow}>
            <Button title="Cancelar" onPress={onClose} color="#888" />
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
