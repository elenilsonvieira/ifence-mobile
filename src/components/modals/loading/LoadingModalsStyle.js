import { StyleSheet } from "react-native";


const LoadingModalsStyle = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    boxContainer: {
        margin: 20,
        borderRadius: 10,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 100,
    },
    text: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        padding: 10,
    }
});

export default LoadingModalsStyle;