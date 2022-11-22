import {StyleSheet} from 'react-native';

export const fenceStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        paddingTop: 22,
        alignItems: 'stretch',
        justifyContent: 'space-between'
    },
    body: {
        display: 'flex',
        flex: 3,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        backgroundColor: '#E9E9E9'
    },
    register: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggle: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-evenly',
        marginBottom: 10,
    },
    header: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flex: 1,
    },
    item: {
        height: 150,
        display: 'flex',
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 30,
        borderRadius: 25,
        backgroundColor: '#0554F2',
    },
    text_header: {
        color: '#000000',
        fontSize: 32,
        fontFamily: 'Montserrat',
        fontWeight: '300',
        margin: 10,
    },
    text: {
        color: '#000000',
        fontSize: 20,
        margin: 10,
    },
    text_item: {
        color: '#FAFBFD',
        fontSize: 32,
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        margin: 20,
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
        paddingBottom: 24,
        alignItems: 'center',
    },
});