import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useContext, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../../themes/theme.json';
import { AuthContext } from '../../contexts/auth';
import { BannerAdComponent } from '../../components/AdsMob/components/BannerAdComponent';

// Menu items configuration
const getMenuItems = (navigation, isProfessional) => [
  {
    key: 'establishments',
    title: 'Estabelecimentos',
    description: 'Gestão dos estabelecimentos',
    icon: 'store',
    onPress: () => navigation.navigate('Establishment'),
  },
  {
    key: 'myEstablishments',
    title: 'Meus Estabelecimentos',
    description: 'Ver e associar os seus estabelecimentos',
    icon: 'storefront',
    onPress: () => navigation.navigate('MyEstablishments'),
  },
  {
    key: 'switchEstablishment',
    title: 'Trocar Estabelecimento',
    description: 'Selecionar outro estabelecimento',
    icon: 'swap-horizontal',
    onPress: () => navigation.navigate('SelectEstablishment'),
  },
  ...(isProfessional ? [{
    key: 'scheduleBlock',
    title: 'Bloqueio de Agenda',
    description: 'Gerenciar bloqueios na agenda',
    icon: 'calendar-lock',
    onPress: () => navigation.navigate('ScheduleBlock'),
  }] : []),
  {
    key: 'profile',
    title: 'Perfil',
    description: 'Dados do usuário',
    icon: 'card-account-details-outline',
    onPress: () => navigation.navigate('ListProfile'),
  },
];

// Remove the styled components definition and replace with regular styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export function Menu({ navigation }) {
  const { signOut, user } = useContext(AuthContext);
  const isProfessional = user.user.profile_id === 3 || user.user.profile_id === 1;

  const menuItems = useMemo(() => getMenuItems(navigation, isProfessional), [navigation, isProfessional]);

  const renderMenuItem = ({ key, title, description, icon, onPress }) => (
    <React.Fragment key={key}>
      <List.Item
        title={title}
        titleStyle={{ fontWeight: 'bold' }}
        description={description}
        left={props => <List.Icon {...props} icon={icon} />}
        right={props => <Icon {...props} name="chevron-right" size={24} />}
        onPress={onPress}
      />
      <Divider />
    </React.Fragment>
  );

  return (
    <SafeAreaView style={styles.container}>
      <List.Section>
        <List.Subheader style={{ fontWeight: 'bold' }}>Menu de Opções</List.Subheader>
        <Divider />
        
        {menuItems.map(renderMenuItem)}

        {isProfessional && (
          <>
            <List.Accordion
              title="Relatórios"
              titleStyle={{ fontWeight: 'bold' }}
              left={props => <List.Icon {...props} icon="clipboard-file" />}
              description="Ver ou exportar"
            >
              <Divider style={{ marginHorizontal: 30, backgroundColor: theme.colors.primary }} />
              <List.Item
                titleStyle={{ fontWeight: 'bold' }}
                title="Financeiro"
                left={props => <List.Icon {...props} style={{ marginLeft: 50 }} icon="currency-usd" />}
                right={props => <Icon {...props} name="chevron-right" size={24} />}
                onPress={() => navigation.navigate('FinancialReport')}
              />
            </List.Accordion>
            <Divider />
          </>
        )}

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
      <BannerAdComponent />
    </SafeAreaView>
  );
}

export default Menu;
