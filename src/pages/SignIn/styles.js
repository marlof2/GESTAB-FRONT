import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    background: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(220, 220, 220)',
        flex:1

    },
    container: {
        width: '90%',
        maxWidth: 400,
    },
    input: {
        marginBottom: 5,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius:50,
        alignContent:'center',
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