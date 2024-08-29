import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4ff'
    },
    container: {
        width: '90%',
        maxWidth: 400,
    },
    input: {
        marginBottom: 5,
    },
    errorText: {
        color: 'red',
        marginLeft: 20,
        marginBottom: 8
    },
    button: {
        marginTop: 10,
        borderRadius: 10
    },
    card: {
        padding: 10,
        borderRadius: 15,
        elevation: 5,
    },
    titleCard: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight:'bold',
    },
})

export default styles