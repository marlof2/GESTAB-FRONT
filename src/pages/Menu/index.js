import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useNavigation } from '@react-navigation/native';
//  const navigation = useNavigation();

const Menu = ({navigation}) => {
    return (
        <View style={styles.container}>
            <List.Section>
                <List.Subheader>Menu de Opções</List.Subheader>

                <Divider />

                <List.Item
                    title="Estabelecimentos"
                    left={props => <List.Icon {...props} icon="store" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('Establishment')}
                />

                <Divider />

                <List.Item
                    title="Gerênciar Perfis"
                    left={props => <List.Icon {...props} icon="face-man-profile" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('Profile')}
                />
                <Divider />

                <List.Item
                    title="Relatórios"
                    left={props => <List.Icon {...props} icon="clipboard-file" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('Profile')}
                />

                <Divider />

                <List.Item
                    title="Serviços"
                    left={props => <List.Icon {...props} icon="cogs" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('Profile')}
                />

                <Divider />

                <List.Item
                    title="Profissionais"
                    left={props => <List.Icon {...props} icon="account-tie" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('Profile')}
                />

                <Divider />

                <List.Item
                    title="Clientes"
                    left={props => <List.Icon {...props} icon="account-group" />}
                    right={props => <Icon {...props} name="chevron-right" size={24} />}
                    onPress={() => navigation.navigate('Profile')}
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
