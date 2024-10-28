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

export default function RenderItem({ data }) {
    const dispatch = useDispatch();
    const item = data.item
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    function openModalEdit(item) {
        dispatch(infoModal({ action: 'edit', data: item, visible: true }));
        closeMenu()
    }

    function openModalDelete(id) {
        dispatch(infoModalDelete({ id: id, visible: true }));
        closeMenu()
    }

    return (
        <Card style={styles.card} >
            <Card.Title title={item.name} titleStyle={styles.titleCard}
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
                        <Menu.Item
                            title="Editar"
                            onPress={() => openModalEdit(item)}
                            leadingIcon={(props) => <Icon name="pencil" color={theme.colors.action.edit} size={26} />}
                        />

                        <Divider />
                        <Menu.Item
                            title="Deletar"
                            onPress={() => openModalDelete(item.id)}
                            leadingIcon={(props) => <Icon name="delete" color={theme.colors.action.delete} size={26} />}
                        />


                    </Menu>
                )}
            />
            <Card.Content style={styles.contentCard}>
                <Text variant="titleMedium">Preço:</Text>
                <Paragraph style={{ marginBottom: 10 }} >{helper.formatMoney(item.amount)}</Paragraph>

                <Text variant="titleMedium">Tempo:</Text>
                <Paragraph style={{ marginBottom: 10 }} >{helper.formatTime(item.time)}</Paragraph>
            </Card.Content>
        </Card>
    )
};