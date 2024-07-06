import { Card, IconButton, Avatar, Paragraph, Chip, } from 'react-native-paper';
import theme from '../../../themes/theme.json'
import { useDispatch } from 'react-redux';
import { infoModalDelete } from '../reducer';
import { helper } from '../../../helpers/inputs';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';

export default function RenderItem({ data }) {
    const item = data.item
    const dispatch = useDispatch();
    async function openModalDelete(establishment_user_id) {
        const obj = { id: establishment_user_id }
        dispatch(infoModalDelete({ data: obj, visible: true }));
    };

    return (
        <Card style={styles.card}>
            <Card.Title
                title={`${data.index + 1}º  ${item.user.name}`} titleStyle={styles.titleCard}
                right={(props) => (
                    <IconButton icon='delete' iconColor='#f00' onPress={() => openModalDelete(item.id)} />
                )}
            />
            <Card.Content>
                <View style={styles.iconText}>
                    <FontAwesome name="cog" size={16} style={styles.icon} />
                    <Paragraph> <Text style={{ fontWeight: '600' }}> Serviço: </Text>{`${item.service.name}`}</Paragraph>
                </View>
                <View style={styles.iconText}>
                    <FontAwesome name="dollar" size={16} style={styles.icon} />
                    <Paragraph> <Text style={{ fontWeight: '600' }}> Valor: </Text> {`${helper.formatMoney(item.service.amount)}`}</Paragraph>
                </View>
                <View style={styles.iconText}>
                    <FontAwesome name="phone" size={16} style={styles.icon} />
                    <Paragraph> <Text style={{ fontWeight: '600' }}> Celular: </Text> {`${helper.maskPhone(item.user.phone)}`}</Paragraph>
                </View>
                <View style={styles.iconText}>
                    <FontAwesome name="info-circle" size={16} style={styles.icon} />
                    <Paragraph style={{ fontWeight: '600' }}> Status: </Paragraph>
                    <Chip>{`${item.status.name}`}</Chip>
                </View>
            </Card.Content>
        </Card>
    )

};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        marginVertical: 8,
        marginHorizontal: 16,
    },
    titleCard: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    icon: {
        marginRight: 0,
    },
});