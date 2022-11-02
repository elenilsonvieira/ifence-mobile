import React from 'react';
import { View, Text, Modal, ActivityIndicator } from 'react-native'
import LoadingModalsStyle from './LoadingModalsStyle';

export default function LoadingModal(props) {
    return(
        <Modal visible={props.modalVisible} animationTYpe="fade" transparent={true} onRequestClose={ ()=> {}}>
            <View style={LoadingModalsStyle.container}>
                <View style={LoadingModalsStyle.boxContainer}>
                    <ActivityIndicator size="large" />  
                    <View>
                        <Text style={LoadingModalsStyle.text}>{props.text ? props.text : "Aguarde..."}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};