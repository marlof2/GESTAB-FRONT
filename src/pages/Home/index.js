import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, Platform } from "react-native";
import { Card, List } from "react-native-paper";
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header";
import { useIsFocused } from '@react-navigation/native';
// import clearFiles from '../../system/deleteOldFiles'
import { StatusBar } from 'react-native';
import theme from '../../../src/themes/theme.json'
import { BannerAdComponent } from '../../components/AdsMob/components/BannerAdComponent';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePayment } from '../../contexts/PaymentContext';
import { AuthContext } from '../../contexts/auth';




export default function Home({ navigation }) {
  const { width } = useWindowDimensions();
  const isFocused = useIsFocused();
  const [establishment, setEstablishment] = useState(null);
  const { checkPayment } = usePayment();
  const { user } = useContext(AuthContext);


  useEffect(() => {
    if (isFocused) {
      StatusBar.setBackgroundColor(theme.colors.primary);
      AsyncStorage.getItem('establishmentIdLogged').then(async (establishmentIdLogged) => {
        setEstablishment(JSON.parse(establishmentIdLogged))

      })
      // clearFiles();
      checkPayment();
    }
  }, [isFocused]);

  const menuItems = [
    {
      title: "Estabelecimentos",
      description: "Gerênciar estabelecimentos.",
      icon: "store",
      onPress: () => navigation.navigate('Establishment'),
    },
    {
      title: "Meus Estabelecimentos",
      description: "Visualizar e associar estabelecimentos.",
      icon: "storefront",
      onPress: () => navigation.navigate('MyEstablishments'),
    },
    {
      title: "Trocar de Estabelecimento",
      description: "Selecione outro estabelecimento.",
      icon: "swap-horizontal",
      onPress: () => navigation.navigate('SelectEstablishment'),
    },
    {
      title: "Fale Conosco",
      description: "Envie feedback, sugestões, melhorias ou reporte um problema.",
      icon: "message",
      onPress: () => navigation.navigate('Feedbacks'),
    },
  ];

  const titleHome = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>
          {establishment?.name}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.background} edges={['left', 'right']}>
      <Header title={titleHome()} showBack={false} showMenu={false} />


      <Animated.ScrollView
        entering={FadeInUp}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingHorizontal: width * 0.05 }
        ]}
      >
        <Animated.View
          entering={FadeInDown.delay(300)}
          style={styles.welcomeContainer}
        >
          <Text style={styles.welcomeText}>Bem-vindo!</Text>
          <Text style={styles.userName}>{user.user?.name}</Text>
          <Text style={styles.subtitle}>O que você gostaria de fazer hoje?</Text>
        </Animated.View>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              {menuItems.map((item, index) => (
                <Animated.View
                  key={item.title}
                  entering={FadeInUp.delay(400 + index * 100)}
                >
                  <List.Item
                    titleStyle={styles.listItemTitle}
                    descriptionStyle={styles.listItemDescription}
                    title={item.title}
                    description={item.description}
                    left={props => (
                      <List.Icon
                        {...props}
                        icon={item.icon}
                        color={theme.colors.primary}
                      />
                    )}
                    onPress={item.onPress}
                    style={styles.listItem}
                  />
                </Animated.View>
              ))}
            </List.Section>
          </Card.Content>
        </Card>
      </Animated.ScrollView>
      <BannerAdComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  welcomeContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    backgroundColor: '#fff',
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  listItemDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
});

