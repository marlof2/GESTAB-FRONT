import { Card, IconButton, Avatar, Paragraph, } from 'react-native-paper';
import styles from '../styles';
import theme from '../../../themes/theme.json'
import { useDispatch } from 'react-redux';
import { infoModalDelete } from '../reducer';
import { helper } from '../../../helpers/inputs';

export default function RenderItem({ data }) {
    const item = data.item.establishment_user
    const id = data.item.id
    const dispatch = useDispatch();

    async function openModalDelete(establishment_user_id) {
        const obj = { id: establishment_user_id }
        dispatch(infoModalDelete({ data: obj, visible: true }));
    };

    return (
        <Card style={styles.card}>
            <Card.Title
                title={item.name} titleStyle={styles.titleCard}
                right={(props) => (
                    <IconButton icon='delete' iconColor={theme.colors.action.delete} onPress={() => openModalDelete(id)} />
                )}
            />
            <Card.Content>
                <Paragraph>{`Responsalvel: Fulano de tal`}</Paragraph>
                <Paragraph>{`Telefone: ${helper.maskPhone(item.phone)}`}</Paragraph>
            </Card.Content>
        </Card>
    )
};