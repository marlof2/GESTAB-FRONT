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
    const [isInPlan, setIsInPlan] = useState(data.item.have_plan_establishment || false);

    async function openModalDelete(establishment_user_id) {
        const obj = { id: establishment_user_id }
        dispatch(infoModalDelete({ data: obj, visible: true }));
    };

    const handlePlanChange = async (boolean) => {
        try {
            const response = await api.put(`/establishment_user/change-plan/${id}`, {
                have_plan_establishment: boolean,
                payment_id: data.item.establishment_user.payment?.id
            });

            if (response.status === 200) {
                setIsInPlan(boolean);
                dispatch(setSnackbar({
                    visible: true,
                    title: boolean ? 'Profissional adicionado ao plano' : 'Profissional removido do plano',
                }));
            }
        } catch (error) {
            dispatch(setSnackbar({
                visible: true,
                title: 'Erro ao atualizar status do plano',
            }));
        }
    };

    return (
        <Card style={styles.card}>
            <Card.Title
                title={item.name} titleStyle={styles.titleCard}
                subtitle={<Text style={{ fontWeight: 'bold' }}>CPF: <Text>{helper.maskCpf(item.cpf)}</Text></Text>}
                left={(props) => <Avatar.Text {...props} label={item.name[0]} />}
            />
            <Card.Content>
                <View style={{ marginLeft: 50 }}>
                    <Paragraph>
                        <Text style={{ fontWeight: 'bold' }}> Tipo de agenda: </Text>
                        {helper.formatTypeSchedule(item.type_schedule) || 'Carregando...'}
                    </Paragraph>
                    <Paragraph>
                        <Text style={{ fontWeight: 'bold' }}> Status do plano: </Text>
                        <Text style={{ color: isInPlan ? theme.colors.success : theme.colors.error }}>
                            {isInPlan ? 'Incluso no plano' : 'Não incluso no plano'}
                        </Text>
                    </Paragraph>
                </View>
            </Card.Content>
            <Card.Actions>
                {data.item.establishment_user.payment != null && (
                    <Button
                        mode="contained"
                        onPress={() => handlePlanChange(!isInPlan)}
                    style={{
                        backgroundColor: isInPlan ? theme.colors.error : theme.colors.action.active,
                        borderRadius: 20,
                        marginRight: 8
                    }}
                    labelStyle={{ fontSize: 15 }}
                    icon={isInPlan ? 'close-circle' : 'check-circle'}
                >
                        {isInPlan ? 'Remover do Plano' : 'Adicionar ao Plano'}
                    </Button>
                )}
                <IconButton
                    icon='delete'
                    iconColor={theme.colors.action.delete}
                    onPress={() => openModalDelete(id)}
                    style={{ backgroundColor: 'transparent' }}
                />
            </Card.Actions>
        </Card>
    )
};