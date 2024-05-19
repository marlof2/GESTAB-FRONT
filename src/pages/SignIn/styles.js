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
        width: 200,
        height: 200
    },
    link: {
        marginTop: 10,
        marginBottom: 10,
        color: '#3b3dbf',
    },
    textLink: {
        marginTop: 15,
        textAlign: 'center',
        color: '#171717'
    },
    areaBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        width: '95%',
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
})

export default styles