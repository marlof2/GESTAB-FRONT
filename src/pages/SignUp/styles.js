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
    areaInput: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    input: {
        width: '95%',
        marginBottom: 5,
    },
    errorText: {
        color: 'red',
        marginLeft: 20,
        marginBottom:8
    },
    areaBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        // width: '95%',
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
})

export default styles