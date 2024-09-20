import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Card, IconButton,  Button } from "react-native-paper";
import Header from "../../components/Header";
import { useIsFocused } from '@react-navigation/native';
import api from "../../services";

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
      me();
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

        {/* Card para Estabelecimentos */}
        <Card style={styles.card} onPress={() => navigation.navigate('Establishment')}>
          <Card.Content style={styles.cardContent}>
            <IconButton icon="store" size={40} />
            <Text style={styles.cardTitle}>Estabelecimentos</Text>
            <Text style={styles.cardDescription}>Gerenciar seus estabelecimentos</Text>
          </Card.Content>
        </Card>

        {/* Card para Meus Estabelecimentos */}
        <Card style={styles.card} onPress={() => navigation.navigate('MyEstablishments')}>
          <Card.Content style={styles.cardContent}>
            <IconButton icon="store" size={40} />
            <Text style={styles.cardTitle}>Meus Estabelecimentos</Text>
            <Text style={styles.cardDescription}>Visualizar e associar estabelecimentos</Text>
          </Card.Content>
        </Card>

        {/* Card para Feedback */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <IconButton icon="message-outline" size={40} />
            <Text style={styles.cardTitle}>Feedback</Text>
            <Text style={styles.cardDescription}>Envie sugestões ou reporte problemas</Text>
            <Button
              mode="outlined"
              style={{ marginTop: 10 }}
              onPress={() => console.log('Feedback enviado')}
            >
              Enviar Feedback
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    padding: 10,
    alignItems: 'center',
  },
  welcomeContainer: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#6200ee',
    marginVertical: 10,
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
    width: '95%', // Largura ajustada para quase toda a tela
    marginVertical: 10,
    borderRadius: 10,
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  cardDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6c757d',
  },
});
