import { Card, IconButton, Avatar, Paragraph, Menu, Divider } from 'react-native-paper';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles';
import theme from '../../../themes/theme.json'
import { useDispatch } from 'react-redux';
import { infoModalDelete } from '../reducer';
import { helper } from '../../../helpers/inputs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RenderItem({ data }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const item = data.item.establishment_user;
    const id = data.item.id;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    async function openModalDelete(establishment_user_id) {
        const obj = { id: establishment_user_id }
        dispatch(infoModalDelete({ data: obj, visible: true }));
        setMenuVisible(false);
    };

    const navigateToSchedulingHistory = () => {
        navigation.navigate('SchedulingHistory', { 
            establishment_id: item.id,
            establishment_name: item.name 
        });
        setMenuVisible(false);
    };

    return (
        <Card style={styles.card}>
            <Card.Title
                title={item.name} 
                titleStyle={styles.titleCard}
                right={(props) => (
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <IconButton 
                                icon="dots-vertical" 
                                onPress={() => setMenuVisible(true)}
                            />
                        }
                    >
                        <Menu.Item 
                            leadingIcon={(props) => <Icon name="history" color={theme.colors.action.active} size={26} />}
                            onPress={navigateToSchedulingHistory} 
                            title="Histórico de agendamentos" 
                        />
                        <Divider />
                        <Menu.Item 
                            leadingIcon={(props) => <Icon name="delete" color={theme.colors.action.delete} size={26} />}
                            onPress={() => openModalDelete(id)} 
                            title="Excluir"
                        />
                    </Menu>
                )}
            />
            <Card.Content>
                <Paragraph>{`Responsalvel: ${item.responsible.name}`}</Paragraph>
                <Paragraph>{`Telefone: ${helper.maskPhone(item.phone)}`}</Paragraph>
            </Card.Content>
        </Card>
    )
};