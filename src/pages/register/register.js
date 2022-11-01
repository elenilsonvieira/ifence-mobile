import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import styles from './registerStyle';
import { useAuth } from '../../context/Auth';
import UserService from '../../services/UserService';


export default function Register() {
    const userService = new UserService();
    const auth = useAuth();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState([]);

    const register = () => {
        const params = {
            name: name,
            email: email,
            password: password
        }
        userService.create(params)
        .then(() => {
            auth.signIn(email, password)
        }).catch((error) => {
            alert("Erro ao criar a conta")
        })
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                keyboardType="text"
                autoCapitalize="none"
                value={name}
                onChangeText={setName}
            />
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
                onPress={() => register()}>
                <Text style={styles.submitText}>Criar</Text>
            </TouchableOpacity>
        </View>
    );
};