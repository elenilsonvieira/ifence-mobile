import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import styles from './styles';
import { useAuth } from '../../context/Auth';


export default function Login() {
    const auth = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState([]);

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
                onPress={() => auth.signIn(email, password)}>
                <Text style={styles.submitText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonRegister}>
                <Text style={styles.registerText}>Criar conta gratuita</Text>
            </TouchableOpacity>
        </View>
    );
};