import { Card, IconButton, Avatar, Paragraph, Chip, Button, Menu, Divider, } from 'react-native-paper';
import theme from '../../../themes/theme.json'
import { useDispatch } from 'react-redux';
import { infoModalDelete } from '../reducer';
import { helper } from '../../../helpers/inputs';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import { useState } from 'react';
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RenderItem({ data }) {
    const item = data.item;
    const dispatch = useDispatch();

    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleMenuItemPress = (action) => {
        if (action === 'concluir') {
            // Lógica para concluir item
        } else if (action === 'desistir') {
            // Lógica para desistir
        } else if (action === 'aguardando-atendimento') {
            // Lógica para mudar para aguardando atendimento
        }
        closeMenu();
    };

    const renderMenuItems = (status) => {
        switch (status) {
            case 1: // Em atendimento
                return (
                    <>
                        <Menu.Item
                            title="Concluído"
                            onPress={() => handleMenuItemPress('concluir')}
                            leadingIcon={(props) => <Icon name="check-circle-outline" color={theme.colors.action.active} size={26} />}
                        />
                        <Menu.Item
                            title="Desistir"
                            onPress={() => handleMenuItemPress('desistir')}
                            leadingIcon={(props) => <Icon name="exit-to-app" color={theme.colors.action.inactive} size={26} />}
                        />
                        <Menu.Item
                            title="Aguardando atendimento"
                            onPress={() => handleMenuItemPress('aguardando-atendimento')}
                            leadingIcon={(props) => <Icon name="clock-alert-outline" color={theme.colors.action.gray} size={26} />}
                        />
                    </>
                );
            case 2: // Aguardando atendimento
                return (
                    <>
                        <Menu.Item
                            title="Em atendimento"
                            onPress={() => handleMenuItemPress('em-atendimento')}
                            leadingIcon={(props) => <Icon name="progress-clock" color={theme.colors.action.active} size={26} />}
                        />
                        <Menu.Item
                            title="Desistir"
                            onPress={() => handleMenuItemPress('desistir')}
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
                        {renderMenuItems(item.status.id)}
                    </Menu>
                )}
            />
            <Card.Content>
                <View style={styles.iconText}>
                    <FontAwesome name="clock-o" size={16} style={styles.icon} />
                    <Paragraph> <Text style={styles.titleCardContent}> Hora: </Text>{`${helper.formatTime(item.time)}`}</Paragraph>
                </View>
                <View style={styles.iconText}>
                    <FontAwesome name="cog" size={16} style={styles.icon} />
                    <Paragraph> <Text style={styles.titleCardContent}> Serviço: </Text>{`${item.service.name}`}</Paragraph>
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
                    <Paragraph style={styles.titleCardContent}> Status: </Paragraph>
                    <Chip style={{ backgroundColor: getStatusColor(item.status.id),  }}>{`${item.status.name}`}</Chip>
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
