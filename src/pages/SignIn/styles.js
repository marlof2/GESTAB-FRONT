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
        width:200,
        height:200
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
    link:{
        marginTop: 10,
        marginBottom: 10,
        color: '#3b3dbf',
    },
    textLink: {
        marginTop: 15,
        textAlign: 'center',
        color:'#171717'
    }
})

export default styles