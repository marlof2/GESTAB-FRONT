
import { Chip, Text } from 'react-native-paper';
import theme from '../../themes/theme.json'

export default function ChipCustom({title}) {
    return (
        <Chip elevation={1} style={{ marginTop:5, backgroundColor: theme.colors.elevation.level2 }}>Estabelecimento: <Text style={{ fontWeight: 'bold' }} >{title}</Text> </Chip>
    )

}