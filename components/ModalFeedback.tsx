import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { spacing, moderateScale } from '../utils/responsive';
import { addFeedback } from '../storage/feedbackStorage';
import api from '@/utils/api';
import { router } from 'expo-router';

type Props = {
	visible: boolean;
	onClose: () => void;
};

const ModalFeedback: React.FC<Props> = ({ visible, onClose }) => {
	const [nome, setNome] = useState('');
	const [contato, setContato] = useState('');
	const [mensagem, setMensagem] = useState('');
	const [enviando, setEnviando] = useState(false);
	const [categoria, setCategoria] = useState<'critica' | 'recomendacoes'>('critica');

	const salvarFeedback = async () => {
		if (!mensagem.trim()) {
			Alert.alert('Aviso', 'Descreva seu feedback.');
			return;
		}
		setEnviando(true);
		try {
			// Salva localmente como pendente e agenda envio para +10s
			const scheduledAt = new Date(Date.now() + 10_000).toISOString();
			await addFeedback({ nome, contato, mensagem, pendente: true, categoria, scheduledAt });
			Alert.alert('Obrigado!', 'Seu feedback foi salvo no dispositivo e será enviado em instantes.');
		} catch (err: any) {
			// Mesmo que haja erro inesperado, salvamos localmente como pendente
			const scheduledAt = new Date(Date.now() + 10_000).toISOString();
			await addFeedback({ nome, contato, mensagem, pendente: true, categoria, scheduledAt });
			Alert.alert('Offline', 'Seu feedback foi salvo e será enviado automaticamente.');
		} finally {
			setNome('');
			setContato('');
			setMensagem('');
			setCategoria('critica');
			onClose();
			// Redireciona para a lista de feedbacks para acompanhar o processamento
			router.push('/(tabs)/Feedbacks');
			setEnviando(false);
		}
	};

	return (
		<Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
			<View style={styles.overlay}>
				<View style={styles.card}>
					<Text style={styles.title}>Ajuda / Feedback</Text>
					<TextInput
						placeholder="Seu nome (opcional)"
						style={styles.input}
						value={nome}
						onChangeText={setNome}
					/>
					<TextInput
						placeholder="E-mail ou telefone (opcional)"
						style={styles.input}
						value={contato}
						onChangeText={setContato}
						keyboardType="email-address"
					/>
					<TextInput
						placeholder="Descreva sua sugestão ou problema"
						style={[styles.input, { height: moderateScale(100), textAlignVertical: 'top' }]}
						value={mensagem}
						onChangeText={setMensagem}
						multiline
					/>
					<View style={styles.pickerWrapper}>
						<Text style={styles.label}>Categoria</Text>
						<View style={styles.pickerBox}>
							<Picker selectedValue={categoria} onValueChange={(v: 'critica' | 'recomendacoes') => setCategoria(v)}>
								<Picker.Item label="crítica" value="critica" />
								<Picker.Item label="recomendações" value="recomendacoes" />
							</Picker>
						</View>
					</View>
					<View style={styles.row}>
						<TouchableOpacity style={[styles.button, styles.btnCancel]} onPress={onClose} disabled={enviando}>
							<Text style={styles.btnText}>Cancelar</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.button, styles.btnSend, styles.btnSendSpacing]} onPress={salvarFeedback} disabled={enviando}>
							<Text style={[styles.btnText, { color: '#fff' }]}>{enviando ? 'Enviando...' : 'Enviar'}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	card: {
		backgroundColor: '#fff',
		width: '90%',
		maxWidth: 420,
		borderRadius: 10,
		padding: spacing(2),
	},
	title: {
		fontSize: moderateScale(18),
		fontWeight: 'bold',
		marginBottom: spacing(1.5),
		color: '#003F88',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 6,
		padding: spacing(1),
		marginBottom: spacing(1),
	},
	pickerWrapper: {
		marginBottom: spacing(1),
	},
	label: {
		marginBottom: spacing(0.5),
		color: '#003F88',
		fontWeight: '600',
	},
	pickerBox: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 6,
		overflow: 'hidden',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	button: {
		paddingVertical: spacing(1),
		paddingHorizontal: spacing(1.5),
		borderRadius: 6,
	},
	btnCancel: {
		backgroundColor: '#eee',
	},
	btnSend: {
		backgroundColor: '#003F88',
	},
	btnSendSpacing: {
		marginLeft: spacing(1),
	},
	btnText: {
		color: '#003F88',
		fontWeight: 'bold',
	},
});

export default ModalFeedback;
