import { Text, Card, List, Paragraph, Button, IconButton, Menu, Divider, Modal, Portal, Chip, } from 'react-native-paper';
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
import { useNavigation } from '@react-navigation/native';

export default function RenderItem({ data, dataUser }) {
    const dispatch = useDispatch();
    const item = data.item
    const userLogged = dataUser
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const navigation = useNavigation();

    function openModalEdit(item) {
        dispatch(infoModal({ action: 'edit', data: item, visible: true }));
        closeMenu()
    }

    function openModalDelete(id) {
        dispatch(infoModalDelete({ id: id, visible: true }));
        closeMenu()
    }
    function navigateToAssociateProfessional(item) {
        closeMenu()
        navigation.navigate('EstablishmentUser', { establishmentId: item.id, establishmentName: item.name })
    }
    function navigateToPlans(item) {
        closeMenu()
        navigation.navigate('PaymentPlans', { establishmentId: item.id, establishmentName: item.name })
    }
    function navigateToAssociateService(item) {
        closeMenu()
        navigation.navigate('Service', { establishmentId: item.id, establishmentName: item.name })
    }

    async function activeItem(id) {
        try {
            const { status } = await api.patch(`/establishments/${id}`);

            if (status == 200) {
                dispatch(reloadItemsCard(true));
                dispatch(setSnackbar({ visible: true, title: 'Ativo com sucesso!' }));
            }

        } catch (error) {
            console.log('erro ao ativar estabelecimento', error)
        }
    }

    function permissioActionsOnlyResponsable() {
        if (item.responsible_id == userLogged.id) {
            return true
        }
        return false
    }

    return (
        <Card style={styles.card} >
            <Card.Title title={item.name} titleStyle={styles.titleCard}
                right={(props) => (
                    permissioActionsOnlyResponsable() ?

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
                            <Menu.Item
                                title="Profissionais"
                                onPress={() => navigateToAssociateProfessional(item)}
                                leadingIcon={(props) => <Icon name="account-group" color={theme.colors.action.association} size={26} />}
                            />
                            <Divider />
                            <Menu.Item
                                title="Serviços"
                                onPress={() => navigateToAssociateService(item)}
                                leadingIcon={(props) => <Icon name="cogs" color={theme.colors.action.service} size={26} />}
                            />
                            <Divider />
                            <Menu.Item
                                title="Editar"
                                onPress={() => openModalEdit(item)}
                                leadingIcon={(props) => <Icon name="pencil" color={theme.colors.action.edit} size={26} />}
                            />

                            <Divider />

                            <Menu.Item
                                title="Planos"
                                onPress={() => navigateToPlans(item)}
                                leadingIcon={(props) => <Icon name="currency-usd" color={'green'} size={26} />}
                            />

                            <Divider />
                            {
                                item.deleted_at ?
                                    (

                                        <Menu.Item
                                            title="Ativar"
                                            onPress={() => activeItem(item.id)}
                                            leadingIcon={(props) => <Icon name="check-circle-outline" color={theme.colors.action.active} size={26} />}
                                        />

                                    )

                                    :
                                    (
                                        <Menu.Item
                                            title="Inativar"
                                            onPress={() => openModalDelete(item.id)}
                                            leadingIcon={(props) => <Icon name="close-circle-outline" color={theme.colors.action.inactive} size={26} />}
                                        />
                                    )
                            }

                        </Menu>
                        :
                        null
                )}
            />
            <Card.Content style={styles.contentCard}>
                <View style={styles.iconText}>
                    <Paragraph > <Text style={styles.titleCardContent}> Responsável: </Text>{item.responsible.name}</Paragraph>
                </View>

                <View style={styles.iconText}>
                    <Paragraph > <Text style={styles.titleCardContent}> Telefone: </Text>{helper.maskPhone(item.phone) ?? 'Não cadastrado'}</Paragraph>
                </View>

                <View style={styles.iconText}>
                    <Paragraph > <Text style={styles.titleCardContent}> {item.tipo_pessoa.id == 1 ? 'CPF:' : 'CNPJ:'} </Text>{item.tipo_pessoa.id == 1 ? helper.maskCpf(item.cpf) : helper.maskCnpj(item.cnpj)}</Paragraph>
                </View>

                <View style={styles.iconText}>
                    <Paragraph > <Text style={styles.titleCardContent}> Tipo de pessoa: </Text>{item.tipo_pessoa.name}</Paragraph>
                </View>

                <View style={styles.iconText}>
                    <Paragraph > <Text style={styles.titleCardContent}> Ativo: </Text>{item.deleted_at ? 'Não' : 'Sim'}</Paragraph>
                </View>

            </Card.Content>
        </Card>
    )
};