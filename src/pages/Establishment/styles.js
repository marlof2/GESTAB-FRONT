import { StyleSheet } from 'react-native';
import theme from '../../themes/theme.json'
const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    input: {
        marginBottom: 5,
    },
    container: { flex: 1 },
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
        margin: 5
    },
    titleCard: {
        marginLeft: 15,
        fontSize: 20,
    },
    fab: {
        position: 'absolute',
        margin: 10,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.primary
    },
})

export default styles