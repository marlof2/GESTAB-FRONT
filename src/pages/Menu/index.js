import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../contexts/auth';
import theme from '../../../src/themes/theme.json'

const Menu = ({ navigation }) => {
    const { signOut, user } = React.useContext(AuthContext);
    const dataUser = user.user;
    const profileProfissional = dataUser.profile_id == 3 || dataUser.profile_id == 1;

    return (
        <View style={styles.container}>
            <List.Section>
                <List.Subheader style={{ fontWeight: 'bold' }}>Menu de Opções</List.Subheader>

                <Divider />

                <List.Item
                    titleStyle={{ fontWeight: 'bold' }}
                    title="Estabelecimentos"
                    left={props => <List.Icon {...props} icon="store" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('Establishment')}
                    description="Gestão dos estabelecimentos"
                />

                <Divider />


                <List.Item
                    title="Meus Estabelecimentos"
                    titleStyle={{ fontWeight: 'bold' }}
                    description="Ver e associar os seus estabelecimentos"
                    left={props => <List.Icon {...props} icon="storefront" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('MyEstablishments')}
                />
                <Divider />

                <List.Item
                    title="Perfil"
                    titleStyle={{ fontWeight: 'bold' }}
                    description="Dados do usuário"
                    left={props => <List.Icon {...props} icon="card-account-details-outline" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('ListProfile')}
                />

                <Divider />

                {profileProfissional && (
                    <List.Accordion
                        title="Relatórios"
                        titleStyle={{ fontWeight: 'bold' }}
                        left={props => <List.Icon {...props} icon="clipboard-file" />}
                        description="Ver ou exportar"
                    >
                        <Divider style={{marginHorizontal:30, backgroundColor: theme.colors.primary}} />
                        <List.Item
                            titleStyle={{ fontWeight: 'bold' }}
                            title="Financeiro"
                            left={props => <List.Icon {...props} style={{marginLeft:50}} icon="currency-usd" />}
                            right={props => <Icon {...props} name="chevron-right" size={24} />}
                            onPress={() => navigation.navigate('FinancialReport')}
                        />
                    </List.Accordion>
                )}

                {profileProfissional && <Divider />}

                <List.Item
                    title="Sair"
                    titleStyle={{ fontWeight: 'bold' }}
                    description="Sair do aplicativo"
                    left={props => <List.Icon {...props} icon="exit-run" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={signOut}
                />
                <Divider />
            </List.Section>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    item: {
        paddingVertical: 10,
    },
});

export default Menu;
