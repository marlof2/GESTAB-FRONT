import { StyleSheet } from 'react-native';
import theme from '../../themes/theme.json'
const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    input: {
        marginBottom: 10,
    },
    safeArea: { flex: 1 },
    errorText: {
        color: 'red',
        marginLeft: 20,
        marginBottom: 8
    },
    button: {
        marginTop: 10,
        borderRadius: 10,
    },
    card: {
        borderRadius: 15,
        margin: 10,
        marginTop:20
    },
    titleCard: {
        marginTop:10,
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom:20,
    },
    fab: {
        position: 'absolute',
        margin: 10,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.primary
    },
    contentCard: { marginLeft: 15 }
})

export default styles