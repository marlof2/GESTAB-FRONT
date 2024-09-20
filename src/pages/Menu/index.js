import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../contexts/auth';
// import { useNavigation } from '@react-navigation/native';
//  const navigation = useNavigation();

const Menu = ({ navigation }) => {
    const { signOut, user } = React.useContext(AuthContext)

    const dataUser = user.user
    return (
        <View style={styles.container}>
            <List.Section>
                <List.Subheader style={{ fontWeight: 'bold' }}>Menu de Opções</List.Subheader>

                <Divider />

                <List.Item
                    title="Estabelecimentos"
                    left={props => <List.Icon {...props} icon="store" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('Establishment')}
                    description="Gestão dos estabelecimentos"
                    />

                <Divider />


                <List.Item
                    title="Relatório de Faturamento"
                    description="Por período"
                    left={props => <List.Icon {...props} icon="clipboard-file" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('Profile')}
                    />

                <Divider />

                <List.Item
                    title="Meus Estabelecimentos"
                    description="Ver e associar os seus estabelecimentos"
                    left={props => <List.Icon {...props} icon="store" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('MyEstablishments')}
                    />
                <Divider />

                <List.Item
                    title="Perfil"
                    description="Dados do usuário"
                    left={props => <List.Icon {...props} icon="card-account-details-outline" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('ListProfile')}
                    />

                <Divider />

                <List.Item
                    title="Sair"
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
