import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Card, Text, List, Divider, Avatar } from 'react-native-paper';
import Header from '../../components/Header';
import { helper } from '../../helpers/inputs';
// import { AuthContext } from '../../contexts/auth';
import { useIsFocused } from '@react-navigation/native'
import api from '../../services';


export default function UserProfileView({ navigation }) {
  // const { name, cpf, email, phone } = route.params.dataUser;
  // const { loadStorage } = useContext(AuthContext)
  const isFocused = useIsFocused()
  const [user, setUser] = useState(null)

  async function me() {
      const response = await api.get('/me')

      if (response.status == 401) {
        await AsyncStorage.clear();
        navigation.navigate('SignIn')
        setUser(null);
      }

      if (response.status == 200) {
        setUser(response.data.user);
      }


  }

  useEffect(() => {
    if (isFocused) {
      me()
    }

    return () => { }

  }, [isFocused])

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Perfil" />

      {/* Card de Dados do Usuário */}
      <Card style={styles.card}>
        <Card.Title
          title={user?.name || 'Usuário'}
          subtitle="Dados Pessoais"
          left={(props) => <Avatar.Text {...props} label={user?.name[0]} />}
          titleStyle={styles.titleCard}
          subtitleStyle={styles.subtitleCard}
        />
        <Divider style={styles.divider} />
        <Card.Content>
          <View style={styles.infoRow}>
            <List.Icon icon="card-account-details-outline" />
            <View style={styles.infoText}>
              <Text style={styles.label}>CPF</Text>
              <Text style={styles.value}>{helper.maskCpf(user?.cpf) || 'Carregando...'}</Text>
            </View>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <List.Icon icon="email-outline" />
            <View style={styles.infoText}>
              <Text style={styles.label}>E-mail</Text>
              <Text style={styles.value}>{user?.email || 'Carregando...'}</Text>
            </View>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <List.Icon icon="phone-outline" />
            <View style={styles.infoText}>
              <Text style={styles.label}>Celular</Text>
              <Text style={styles.value}>{helper.maskPhone(user?.phone) || 'Carregando...'}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Novo Card com Lista de Ações */}
      <Card style={styles.actionCard}>
        <Card.Title title="⚙️ Ações" />
        <Card.Content>
          <List.Section>
            <List.Item
              title="Editar Perfil"
              description="Alterar as informações do usuário"
              left={props => <List.Icon {...props} icon="pencil-outline" />}
              onPress={() => navigation.navigate('FormProfile', { user })}
            />
            <Divider />
            <List.Item
              title="Trocar a Senha"
              description="Alterar a senha do usuário"
              left={props => <List.Icon {...props} icon="lock-outline" />}
              onPress={() => navigation.navigate('FomPasswordChange', { user })}
            />
            <Divider />
            <List.Item
              title="Apagar Conta"
              description="Excluir permanentemente a conta"
              left={props => <List.Icon {...props} icon="delete-outline" color="red" />}
              titleStyle={{ color: 'red' }}
              onPress={() => {
                // Adicione a lógica para apagar a conta aqui
                console.log('Conta apagada');
              }}
            />
          </List.Section>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 15,
    borderRadius: 10,
    elevation: 3, // Sombra para o card
    backgroundColor: '#fff',
  },
  actionCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 0,
    borderRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    marginLeft: 16,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#495057',
  },
  titleCard: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
  },
  subtitleCard: {
    fontSize: 14,
    color: '#6c757d',
  },
  divider: {
    marginVertical: 5,
  },
});

