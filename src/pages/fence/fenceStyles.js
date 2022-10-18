import {StyleSheet} from 'react-native';

export const fenceStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        paddingTop: 22,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    body: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
    },
    register: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        backgroundColor: '#00ff00',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    item: {
        flex: 3,
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_header: {
        color: '#000000',
        fontSize: 35,
        fontStyle: 'italic',
        margin: 10,
    },
    text: {
        color: '#000000',
        fontSize: 20,
        margin: 10,
    },
    text_item: {
        color: '#000000',
        fontSize: 35,
        margin: 5,
    },
    input: {
        width: '75%',
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 20,
    },
    button: {
        width: 150,
        height: 50,
        backgroundColor: '#00ff00',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
    },
    deleteButton: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#037272',
        padding: 10,
        borderRadius: 8,
    },
    title: {
        color: '#000000',
        fontSize: 28,
        fontWeight: 'bold',
        paddingBottom: 24
    },
});