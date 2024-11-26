import { Text, Card, List, Paragraph, Button, IconButton, Menu, Divider, Modal, Portal, Chip, Switch, Avatar, } from 'react-native-paper';
import styles from '../styles';
import { Platform, View } from 'react-native';
import { useState } from 'react';
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../../themes/theme.json'
import { helper } from '../../../helpers/inputs';
import { useDispatch } from 'react-redux';
import { infoModal, infoModalDelete, reloadItemsCard } from '../reducer';
import { setSnackbar } from '../../../store/globalSlice';
import api from "../../../services";

export default function RenderItem({ data }) {
    const item = data.item.user
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
                subtitle={<Text style={{fontWeight:'bold'}}>CPF: <Text>{helper.maskCpf(item.cpf)}</Text></Text>}
                left={(props) => <Avatar.Text {...props} label={item.name[0]} />}
                right={(props) => (
                    <IconButton icon='delete' iconColor={theme.colors.action.delete} onPress={() => openModalDelete(id)} />
                )}
            />
            <Card.Content>
                <View style={{ marginLeft: 50 }}>
                    <Paragraph > <Text style={{fontWeight: 'bold'}}> Tipo de agenda: </Text>{helper.formatTypeSchedule(item.type_schedule) || 'Carregando...'}</Paragraph>
                </View>
            </Card.Content>
        </Card>
    )
};