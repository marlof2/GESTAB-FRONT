import { Card, IconButton, Avatar, Paragraph, Chip, Button, Menu, Divider, } from 'react-native-paper';
import theme from '../../../themes/theme.json'
import { useDispatch } from 'react-redux';
import { helper } from '../../../helpers/inputs';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import { useState } from 'react';
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../../services';
import { reloadItemsCard } from '../reducer';
import { setSnackbar } from '../../../store/globalSlice';

export default function RenderItem({ data }) {
    const item = data.item;
    const dispatch = useDispatch();

    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const statusEmAtendimento = async (id) => {
        try {
            const { status } = await api.put(`/list/statusEmAtendimento/${id}`);

            if (status == 200) {
                dispatch(reloadItemsCard(true));
                closeModal()
                dispatch(setSnackbar({ visible: true, title: 'Alterado com sucesso!' }));
            }
            closeMenu();
        } catch (error) {
            console.log('erro ao alterar o status', error)
            closeMenu();
        }
    };
    const statusConcluido = async (id) => {
        try {
            const { status } = await api.put(`/list/statusConcluido/${id}`);

            if (status == 200) {
                dispatch(reloadItemsCard(true));
                dispatch(setSnackbar({ visible: true, title: 'Alterado com sucesso!' }));
            }
            closeMenu();
        } catch (error) {
            console.log('erro ao alterar o status', error)
            closeMenu();
        }
    };
    const statusAguardandoAtendimento = async (id) => {
        try {
            const { status } = await api.put(`/list/statusAguardandoAtendimento/${id}`);

            if (status == 200) {
                dispatch(reloadItemsCard(true));
                dispatch(setSnackbar({ visible: true, title: 'Alterado com sucesso!' }));
            }
            closeMenu();
        } catch (error) {
            console.log('erro ao alterar o status', error)
            closeMenu();
        }
    };
    const statusDesistiu = async (id) => {
        try {
            const { status } = await api.put(`/list/statusDesistiu/${id}`);

            if (status == 200) {
                dispatch(reloadItemsCard(true));
                dispatch(setSnackbar({ visible: true, title: 'Alterado com sucesso!' }));
            }
            closeMenu();
        } catch (error) {
            console.log('erro ao alterar o status', error)
            closeMenu();
        }
    };



    const renderMenuItems = (status, id) => {
        switch (status) {
            case 1: // Em atendimento
                return (
                    <>
                        <Menu.Item
                            title="Concluído"
                            onPress={() => statusConcluido(id)}
                            leadingIcon={(props) => <Icon name="check-circle-outline" color={theme.colors.action.active} size={26} />}
                        />
                        <Menu.Item
                            title="Desistir"
                            onPress={() => statusDesistiu(id)}
                            leadingIcon={(props) => <Icon name="exit-to-app" color={theme.colors.action.inactive} size={26} />}
                        />
                        <Menu.Item
                            title="Aguardando atendimento"
                            onPress={() => statusAguardandoAtendimento(id)}
                            leadingIcon={(props) => <Icon name="clock-alert-outline" color={theme.colors.action.gray} size={26} />}
                        />
                    </>
                );
            case 2: // Aguardando atendimento
                return (
                    <>
                        <Menu.Item
                            title="Em atendimento"
                            onPress={() => statusEmAtendimento(id)}
                            leadingIcon={(props) => <Icon name="progress-clock" color={theme.colors.action.active} size={26} />}
                        />
                        <Menu.Item
                            title="Desistir"
                            onPress={() => statusDesistiu(id)}
                            leadingIcon={(props) => <Icon name="exit-to-app" color={theme.colors.action.inactive} size={26} />}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 1:
                return theme.colors.action.active; // Em atendimento
            case 2:
                return theme.colors.action.gray; // Aguardando atendimento
            case 3:
                return theme.colors.action.active; // Concluído
            default:
                return theme.colors.action.default;
        }
    };

    return (
        <Card style={styles.card}>
            <Card.Title
                title={`${data.index + 1}º  ${item.user.name}`} titleStyle={styles.titleCard}
                right={(props) => (
                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <IconButton
                                {...props}
                                icon={MORE_ICON}
                                onPress={openMenu}
                            />
                        }
                    >
                        {renderMenuItems(item.status.id, item.id)}
                    </Menu>
                )}
            />
            <Card.Content>
                {
                    item.time != null && (
                        <View style={styles.iconText}>
                            <FontAwesome name="clock-o" size={16} style={styles.icon} />
                            <Paragraph> <Text style={styles.titleCardContent}> Hora: </Text>{`${helper.formatTime(item.time)}`}</Paragraph>
                        </View>
                    )
                }
                <View style={styles.iconText}>
                    <FontAwesome name="cog" size={16} style={styles.icon} />
                    <Paragraph> <Text style={styles.titleCardContent}> Serviço: </Text>{`${item.service.name}`}</Paragraph>
                </View>
                <View style={styles.iconText}>
                    <FontAwesome name="hourglass-half" size={16} style={styles.icon} />
                    <Paragraph> <Text style={styles.titleCardContent}> Tempo: </Text>{`${helper.formatTime(item.service.time)} min`}</Paragraph>
                </View>
                <View style={styles.iconText}>
                    <FontAwesome name="dollar" size={16} style={styles.icon} />
                    <Paragraph> <Text style={styles.titleCardContent}> Valor: </Text> {`${helper.formatMoney(item.service.amount)}`}</Paragraph>
                </View>
                <View style={styles.iconText}>
                    <FontAwesome name="phone" size={16} style={styles.icon} />
                    <Paragraph> <Text style={styles.titleCardContent}> Celular: </Text> {`${helper.maskPhone(item.user.phone)}`}</Paragraph>
                </View>
                <View style={styles.iconText}>
                    <FontAwesome name="info-circle" size={16} style={styles.icon} />
                    <Paragraph style={styles.titleCardContent}> Situação: </Paragraph>
                    <Chip style={{ backgroundColor: getStatusColor(item.status.id), }}><Text style={{color:'white'}}>{`${item.status.name}`}</Text></Chip>
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
    titleCardContent: {
        fontWeight: '600',
        fontSize: 15,
    },
});
