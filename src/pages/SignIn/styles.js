import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    background: {
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
        width: 150,
        height: 150,
        marginBottom:5,
        marginTop:'30%'
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
        marginTop:20
    },
    titleCard: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight:'bold'
    },
})

export default styles