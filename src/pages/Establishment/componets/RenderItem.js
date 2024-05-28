import { Text, Card, List, Paragraph, Button, IconButton, Menu, Divider } from 'react-native-paper';
import styles from '../styles';
import { Platform, View } from 'react-native';
import { useState } from 'react';
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../../themes/theme.json'
import { helper } from '../../../helpers/inputs';

export default function renderItem({ data }) {
    const item = data.item
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);


    function edit(item) {
    }
    function deletar(id) {
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
                            onPress={edit(item)}
                            leadingIcon={(props) => <Icon name="pencil" color={theme.colors.action.edit} size={26} />}
                        />
                        <Divider />
                        <Menu.Item
                            title="Apagar"
                            onPress={deletar(item.id)}
                            leadingIcon={(props) => <Icon name="delete" color={theme.colors.action.delete} size={26} />}
                        />
                    </Menu>
                )}
            />
            <Card.Content>
                <List.Item
                    description={() => (
                        <View>
                            <Text variant="titleMedium">Tipo de pessoa:</Text>
                            <Paragraph style={{ marginBottom: 10 }} >{item.tipo_pessoa.name}</Paragraph>

                            <Text variant="titleMedium">{item.tipo_pessoa.id == 1 ? 'CPF:' : 'CNPJ:'}</Text>
                            <Paragraph style={{ marginBottom: 10 }} >{item.tipo_pessoa.id == 1 ? helper.maskCpf(item.cpf) : helper.maskCnpj(item.cnpj)}</Paragraph>

                            <Text variant="titleMedium">Telefone:</Text>
                            <Paragraph style={{ marginBottom: 10 }} >{helper.maskPhone(item.phone)}</Paragraph>
                        </View>
                    )}
                />
            </Card.Content>
        </Card>
    )
};