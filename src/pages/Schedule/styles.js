import { StyleSheet } from 'react-native';
import theme from '../../themes/theme.json'
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    background: { flex: 1,},
    card: {
        margin: 8,
        backgroundColor: '#ffffff',
    },
    titleCard: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        margin: 10,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.primary
    },
    titleEstablishment: {
        fontSize: 16,
        fontWeight: 'bold',
    }
})

export default styles