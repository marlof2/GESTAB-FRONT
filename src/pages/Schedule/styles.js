import { StyleSheet } from 'react-native';
import theme from '../../themes/theme.json'
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    background: { flex: 1,},
    card: {
        margin: 8,
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
    },
    menuItem: {
        height: 44,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginHorizontal: 4,
        marginVertical: 2,
    },
    menuItemText: {
        fontSize: 16,
        letterSpacing: 0.15,
    },
    divider: {
        height: 1,
        marginHorizontal: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
    },
})

export default styles