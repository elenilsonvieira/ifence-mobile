import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import styles from './styles';
import { useAuth } from '../../context/Auth';
import LoadingModal from '../../components/modals/loading/LoadingModals';

export default function Login() {
    const auth = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState([]);
    const [visible, setVisible] = useState(false);

    const login = () => {
        setVisible(true)
        auth.signIn(email, password)
        .then(() => {
            setVisible(false)
        }).catch((error) => {
            alert("Não foi possível realizar o login")
        });
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                autoCompleteType="email"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                //keyboardType="visible-password"
                textContentType="password"
                autoCapitalize="none"
                autoCompleteType="password"
                autoCorrect={false}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity 
                style={styles.buttonSubmit}
                onPress={login}>
                <Text style={styles.submitText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonRegister}>
                <Text style={styles.registerText}>Criar conta gratuita</Text>
            </TouchableOpacity>

            <LoadingModal
                modalVisible={visible}
                text="Carregando..."
            />
        </View>
    );
};