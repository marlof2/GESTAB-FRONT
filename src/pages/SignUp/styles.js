import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#f0f4ff'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        marginBottom: 25
    },
    areaInput: {
        flexDirection: 'row',
    },
    input: {
        backgroundColor: '#fff',
        width: '90%',
        height: 45,
        borderWidth: 1,
        borderColor: '#222',
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    button: {
        width: '90%',
        height: 45,
        borderRadius: 10,
        backgroundColor: '#3b3dbf',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    textButton: {
        fontSize: 20,
        color: '#fff',
    },
})

export default styles