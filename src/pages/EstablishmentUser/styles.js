import { StyleSheet } from 'react-native';
import theme from '../../themes/theme.json'
const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: { flex: 1 },
    card: {
        margin:8,
        // marginVertical: 8,
        backgroundColor: '#ffffff',
    },
    titleCard: {
        fontSize:17,
        fontWeight: 'bold',
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