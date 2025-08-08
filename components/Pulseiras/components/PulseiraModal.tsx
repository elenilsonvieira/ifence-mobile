import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface PulseiraModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (nome: string, identificador: string) => void;
  initialNome?: string;
  initialIdentificador?: string;
}


export default function PulseiraModal({ visible, onClose, onSave, initialNome = '', initialIdentificador = '' }: PulseiraModalProps) {
  const [nome, setNome] = React.useState(initialNome);
  const [identificador, setIdentificador] = React.useState(initialIdentificador);
  const router = useRouter();

  React.useEffect(() => {
    setNome(initialNome);
    setIdentificador(initialIdentificador);
  }, [initialNome, initialIdentificador, visible]);

  const handleCancel = () => {
    onClose();
    router.push('/(tabs)/Home');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Pulseira</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da criança"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Identificador da pulseira"
            value={identificador}
            onChangeText={setIdentificador}
          />
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onSave(nome, identificador)}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: 340,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003F88',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#003F88',
    borderWidth: 1,
    borderColor: '#003F88',
    width: 220,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#003F88',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
