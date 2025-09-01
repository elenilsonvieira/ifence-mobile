import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { usePulseiras, Pulseira } from '../hooks/usePulseiras';
import PulseiraModal from '../components/PulseiraModal';
import PulseiraTable from '../components/PulseiraTable';
import { spacing, moderateScale } from '../../../utils/responsive';

export default function PulseirasPages() {
  const { pulseiras, loading, addPulseira, updatePulseira, deletePulseira } = usePulseiras();
  const [modalVisible, setModalVisible] = useState(false);
  const [editPulseira, setEditPulseira] = useState<Pulseira | null>(null);

  // Estados para o formulário de criação
  const [nome, setNome] = useState("");
  const [identificador, setIdentificador] = useState("");

  const handleCriar = () => {
    if (!nome.trim() || !identificador.trim()) return;
    addPulseira({ nome, identificador });
    setNome("");
    setIdentificador("");
  };

  const handleSave = (nome: string, identificador: string) => {
    if (editPulseira) {
      updatePulseira(editPulseira.id, { nome, identificador });
    }
    setModalVisible(false);
    setEditPulseira(null);
  };

  const handleEdit = (pulseira: Pulseira) => {
    setEditPulseira(pulseira);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditPulseira(null);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Nova Pulseira</Text>
      {/* Formulário de criação de pulseira */}
      <View style={styles.formContainer}>
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
        <TouchableOpacity style={styles.button} onPress={handleCriar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Pulseiras Cadastradas</Text>
      <PulseiraTable pulseiras={pulseiras} onEdit={handleEdit} onDelete={deletePulseira} />
      {/* Modal apenas para edição/exclusão */}
      <PulseiraModal
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setEditPulseira(null); }}
        onSave={handleSave}
        initialNome={editPulseira?.nome}
        initialIdentificador={editPulseira?.identificador}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing(2.5),
    backgroundColor: '#fff',
  },
  formContainer: {
    marginBottom: spacing(3),
    backgroundColor: '#f5f5f5',
    padding: spacing(1.5),
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: spacing(1),
    marginBottom: spacing(1),
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#003F88',
    borderRadius: 5,
    padding: spacing(2),
    alignItems: 'center',
    marginTop: spacing(1.25),
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#003F88',
    marginBottom: spacing(2.5),
    textAlign: 'center',
  },
});
