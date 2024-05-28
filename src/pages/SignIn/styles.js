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
    logo: {
        width: 200,
        height: 200
    },
    button: {
        marginTop: 10,
        borderRadius: 10
    },
    errorText: {
        color: 'red',
        marginLeft: 20,
        marginBottom: 8
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    card: {
        padding: 10,
        borderRadius: 15,
        elevation: 5,
    },
    titleCard: {
        textAlign: 'center',
        fontSize: 20,
    },
})

export default styles