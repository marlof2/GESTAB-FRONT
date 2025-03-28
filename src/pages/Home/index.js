import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, Platform, Image, Linking, ScrollView } from "react-native";
import { Card, List, Portal, Modal, Button } from "react-native-paper";
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
import { Avatar } from 'react-native-paper';
import api from '../../services';
import { setSnackbar } from '../../store/globalSlice';
import { useDispatch } from 'react-redux';


export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const isFocused = useIsFocused();
  const [establishment, setEstablishment] = useState(null);
  const { checkPayment } = usePayment();
  const { user, loadStorage } = useContext(AuthContext);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (isFocused) {
      StatusBar.setBackgroundColor(theme.colors.primary);
      AsyncStorage.getItem('establishmentIdLogged').then(async (establishmentIdLogged) => {
        setEstablishment(JSON.parse(establishmentIdLogged))

      })
      // clearFiles();
      checkPayment();
      checkTermsAcceptance();
    }
  }, [isFocused]);

  const checkTermsAcceptance = async () => {
    if (user.user?.terms_accepted == 0) {
      setIsTermsModalVisible(true);
    }
  };

  const handleAcceptTerms = async () => {
    try {
      await updateTermsAcceptance(user.user.id);
      setIsTermsModalVisible(false);
      loadStorage();
    } catch (error) {
      console.error('Erro ao salvar aceitação dos termos:', error);
    }
  };

  const handleEmail = () => {
    Linking.openURL('mailto:suportegestab@gmail.com');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/5571991717209');
  };

  const updateTermsAcceptance = async (userId) => {
    setLoading(true);
    try {
      const response = await api.patch(`/users/${userId}`, { terms_accepted: 1 });
      if (response.status == 200) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Erro ao atualizar aceitação dos termos:', error);
      dispatch(setSnackbar({ visible: true, title: 'Erro ao atualizar aceitação dos termos!' }));
    } finally {
      setLoading(false);
    }
  };

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
      onPress: () => setIsContactModalVisible(true),
    },
  ];

  const titleHome = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>
          Estabelecimento
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.background} edges={['left', 'right']}>
      <Header title={titleHome()} subtitle={establishment?.name} showBack={false} showMenu={false} />


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
          {user.user?.avatar ? (
            <Image
              source={{ uri: user.user.avatar }}
              style={styles.avatarImage}
            />
          ) : (
            <Avatar.Text
              size={80}
              label={user.user?.name?.[0] || ''}
              style={[styles.avatarImage, { backgroundColor: theme.colors.primary }]}
              labelStyle={{ fontSize: 32, color: 'white' }}
            />
          )}
          {/* <Text style={styles.welcomeText}>Olá,</Text> */}
          <Text style={styles.userName}>Olá, {user.user?.name}</Text>
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

      <Portal>
        <Modal
          visible={isContactModalVisible}
          onDismiss={() => setIsContactModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card style={styles.modalCard}>
            <View style={styles.modalHeaderContainer}>
              <Avatar.Icon
                icon="headset"
                size={30}
                color="white"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <Text style={styles.modalTitle}>Fale Conosco</Text>
              <Text style={styles.modalSubtitle}>Escolha uma forma de contato</Text>
            </View>
            
            <Card.Content>
              <List.Section>
                <List.Item
                  title="E-mail"
                  description="suportegestab@gmail.com"
                  left={props => (
                    <List.Icon
                      {...props}
                      icon="email"
                      color="white"
                      style={[styles.iconBackground, { backgroundColor: '#DB4437' }]}
                    />
                  )}
                  onPress={handleEmail}
                  style={styles.contactItem}
                  titleStyle={styles.contactItemTitle}
                  descriptionStyle={styles.contactItemDescription}
                />

                <List.Item
                  title="WhatsApp"
                  description="(71) 99171-7209"
                  left={props => (
                    <List.Icon
                      {...props}
                      icon="whatsapp"
                      color="white"
                      style={[styles.iconBackground, { backgroundColor: '#25D366' }]}
                    />
                  )}
                  onPress={handleWhatsApp}
                  style={styles.contactItem}
                  titleStyle={styles.contactItemTitle}
                  descriptionStyle={styles.contactItemDescription}
                />
              </List.Section>

              <Text style={styles.supportText}>
                Nossa equipe está disponível para ajudar você com sugestões, dúvidas ou problemas.
              </Text>
            </Card.Content>

            <Card.Actions style={styles.modalActions}>
              <Button
                mode="contained"
                onPress={() => setIsContactModalVisible(false)}
                style={styles.modalButton}
              >
                Fechar
              </Button>
            </Card.Actions>
          </Card>
        </Modal>

        <Modal
          dismissable={false}
          visible={isTermsModalVisible}
          onDismiss={() => setIsTermsModalVisible(false)}
          contentContainerStyle={styles.termsModalContainer}
        >
          <Text style={styles.modalTitle}>Termos de Uso e Política de Privacidade</Text>

          <ScrollView style={styles.termsScrollView}>
            <Text style={styles.termsText}>
              1. ACEITAÇÃO DOS TERMOS{'\n\n'}
              Ao acessar e usar este aplicativo, você concorda em cumprir e estar vinculado aos seguintes termos e condições.{'\n\n'}

              2. USO DO APLICATIVO{'\n\n'}
              2.1. O aplicativo é fornecido "no estado em que se encontra", sem garantias de qualquer natureza.{'\n'}
              2.2. O desenvolvedor não se responsabiliza por quaisquer danos diretos, indiretos, incidentais ou consequentes.{'\n\n'}

              3. RESPONSABILIDADES DO USUÁRIO{'\n\n'}
              3.1. O usuário é inteiramente responsável pela precisão e veracidade das informações fornecidas.{'\n'}
              3.2. O usuário deve manter suas credenciais de acesso em segurança.{'\n\n'}

              4. LIMITAÇÃO DE RESPONSABILIDADE{'\n\n'}
              4.1. O desenvolvedor não será responsável por quaisquer perdas ou danos resultantes do uso do aplicativo.{'\n'}
              4.2. O usuário concorda em usar o aplicativo por sua conta e risco.{'\n\n'}

              5. PROPRIEDADE INTELECTUAL{'\n\n'}
              Todos os direitos de propriedade intelectual relacionados ao aplicativo são reservados.{'\n\n'}

              6. ALTERAÇÕES NOS TERMOS{'\n\n'}
              O desenvolvedor reserva-se o direito de modificar estes termos a qualquer momento.{'\n\n'}

              7. LEI APLICÁVEL{'\n\n'}
              Estes termos são regidos pelas leis do Brasil.
            </Text>
          </ScrollView>

          <View style={styles.termsButtonContainer}>
            <Button
              loading={loading}
              mode="contained"
              onPress={handleAcceptTerms}
              style={styles.acceptButton}
            >
              Aceitar Termos
            </Button>
          </View>
        </Modal>
      </Portal>

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
  // welcomeText: {
  //   fontSize: 28,
  //   fontWeight: 'bold',
  //   color: theme.colors.primary,
  //   marginBottom: 8,
  // },
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
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  modalContainer: {
    padding: 20,
    margin: 20,
  },
  modalCard: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  modalHeaderContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  iconBackground: {
    borderRadius: 30,
    margin: 8,
    padding: 8,
  },
  contactItem: {
    paddingVertical: 12,
    marginVertical: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  contactItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  contactItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalActions: {
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
  },
  termsModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  termsScrollView: {
    maxHeight: '70%',
    marginVertical: 20,
  },
  termsText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  termsButtonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
  },
});

