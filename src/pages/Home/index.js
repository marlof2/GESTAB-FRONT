import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Card, Button, List } from "react-native-paper";
import Header from "../../components/Header";
import { useIsFocused } from '@react-navigation/native';
import api from "../../services";
import clearFiles from '../../system/deleteOldFiles'
import { StatusBar } from 'react-native';
import theme from '../../../src/themes/theme.json'


export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  const [user, setUser] = useState(null);

  async function me() {
    const response = await api.get('/me');

    if (response.status == 401) {
      await AsyncStorage.clear();
      navigation.navigate('SignIn');
      setUser(null);
    }

    if (response.status == 200) {
      setUser(response.data.user);
    }
  }

  useEffect(() => {
    if (isFocused) {
      StatusBar.setBackgroundColor(theme.colors.primary);
      me();
      clearFiles()
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.background}>
      <Header title="Home" showBack={false} showMenu={false} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bem-vindo!</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.subtitle}>O que você gostaria de fazer hoje?</Text>
        </View>

        {/* Card único com as opções */}
        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Item
                titleStyle={{ fontWeight: 'bold' }}
                title="Estabelecimentos"
                description="Gerênciar estabelecimentos."
                left={props => <List.Icon {...props} icon="store" />}
                onPress={() => navigation.navigate('Establishment')}
              />
              <List.Item
                titleStyle={{ fontWeight: 'bold' }}
                title="Meus Estabelecimentos"
                description="Visualizar e associar estabelecimentos."
                left={props => <List.Icon {...props} icon="storefront" />}
                onPress={() => navigation.navigate('MyEstablishments')}
                />
              <List.Item
                titleStyle={{ fontWeight: 'bold' }}
                title="Fale Conosco"
                description="Envie feedback, sugestões, melhorias ou reporte um problema."
                left={props => <List.Icon {...props} icon="message" />}
                onPress={() => navigation.navigate('Feedbacks')}
              />
            </List.Section>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 10,
    alignItems: 'center',
  },
  welcomeContainer: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  userName: {
    fontSize: 21,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginVertical: 5,
  },
  card: {
    width: '95%',
    marginVertical: 10,
    borderRadius: 10,
    elevation: 4,
  },
});

