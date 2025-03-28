import { useContext, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Modal, Share, Linking, TextInput, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import CheckoutMercadoPago from '../../../services/paymentService/checkoutMercadoPago';
import LinkCheckoutMercadoPago from '../../../services/paymentService/linkCheckoutMercadoPago';
import { AuthContext } from '../../../contexts/auth';
import Header from '../../../components/Header';
import api from "../../../services";
import theme from '../../../themes/theme.json';
import { Button } from 'react-native-paper';
import AlertSnackbar from '../../../components/Ui/Snackbar';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../../../store/globalSlice';

export default function PaymentPlans({ route }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const { user } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const { establishmentId, establishmentName } = route.params;
  const [removeAds, setRemoveAds] = useState(false);
  const [paymentPeriod, setPaymentPeriod] = useState('monthly');

  const plans = [
    {
      id: 1,
      title: 'Plano Básico',
      quantity_professionals: 2,
      pixPrice: 'R$ 34,99',
      creditPrice: 'R$ 36,99',
      yearlyPixPrice: 'R$ 360,00',
      yearlyCreditPrice: 'R$ 378,90',
      features: ['Sem anúncios para 2 profissionais', 'Acesso exclusivo a relatório financeiro'],
      withAdsRemoval: {
        pixPrice: 'R$ 49,99',
        creditPrice: 'R$ 51,99',
        yearlyPixPrice: 'R$ 480,00',
        yearlyCreditPrice: 'R$ 520,00',
        features: ['Sem anúncios para 2 profissionais', 'Acesso exclusivo a relatório financeiro', 'Sem anúncios para clientes',],
      }
    },
    {
      id: 2,
      title: 'Plano Intermediário',
      quantity_professionals: 4,
      pixPrice: 'R$ 54,99',
      creditPrice: 'R$ 57,99',
      yearlyPixPrice: 'R$ 600,00',
      yearlyCreditPrice: 'R$ 630,00',
      features: ['Sem anúncios para 4 profissionais', 'Acesso exclusivo a relatório financeiro'],
      withAdsRemoval: {
        pixPrice: 'R$ 69,99',
        creditPrice: 'R$ 71,99',
        yearlyPixPrice: 'R$ 720,00',
        yearlyCreditPrice: 'R$ 750,00',
        features: ['Sem anúncios para 4 profissionais', 'Acesso exclusivo a relatório financeiro', 'Sem anúncios para clientes'],
      }
    },
    {
      id: 3,
      title: 'Plano Premium',
      quantity_professionals: 99,
      pixPrice: 'R$ 74,99',
      creditPrice: 'R$ 78,99',
      yearlyPixPrice: 'R$ 840,00',
      yearlyCreditPrice: 'R$ 884,00',
      features: ['Sem anúncios para profissionais ilimitados', 'Acesso exclusivo a relatório financeiro'],
      withAdsRemoval: {
        pixPrice: 'R$ 89,99',
        creditPrice: 'R$ 91,99',
        yearlyPixPrice: 'R$ 960,00',
        yearlyCreditPrice: 'R$ 999,00',
        features: ['Sem anúncios para profissionais ilimitados', 'Acesso exclusivo a relatório financeiro', 'Sem anúncios para clientes'],
      }
    }
  ];

  function formatPrice(priceString) {
    return priceString.replace('R$ ', '').replace(',', '.');
  }

  function handleSelectPlan(planId) {
    setSelectedPlan(planId);
  }

  async function checkActivePayment(establishmentId) {
    try {
      const response = await api.get(`/payments/hasActivePayment/${establishmentId}`);
      return response.data.isActive;
    } catch (error) {
      console.error('Error checking active payment:', error);
      Alert.alert('Erro', 'Não foi possível verificar o status do pagamento.');
      return false;
    }
  }


  async function handlePayment() {
    if (!selectedPlan || !paymentMethod) {
      Alert.alert('Atenção', 'Por favor, selecione um plano e método de pagamento para continuar.');
      return;
    }

    setIsLoading(true);
    try {
      // Check for active payment before proceeding
      const hasActive = await checkActivePayment(establishmentId);
      if (hasActive) {
        Alert.alert('Atenção', 'Você já possui um plano ativo para este estabelecimento.');
        return;
      }

      // Proceed with checkout if no active payment
      const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
      const priceString = removeAds
        ? (paymentPeriod === 'yearly'
          ? (paymentMethod === 'credit_card'
            ? selectedPlanData.withAdsRemoval.yearlyCreditPrice
            : selectedPlanData.withAdsRemoval.yearlyPixPrice)
          : (paymentMethod === 'credit_card'
            ? selectedPlanData.withAdsRemoval.creditPrice
            : selectedPlanData.withAdsRemoval.pixPrice))
        : (paymentPeriod === 'yearly'
          ? (paymentMethod === 'credit_card'
            ? selectedPlanData.yearlyCreditPrice
            : selectedPlanData.yearlyPixPrice)
          : (paymentMethod === 'credit_card'
            ? selectedPlanData.creditPrice
            : selectedPlanData.pixPrice));

      const data = {
        payment_method: paymentMethod,
        user_id: user.user.id,
        plan_id: selectedPlan,
        establishment_id: establishmentId,
        payment_period: paymentPeriod,
        plan_title: selectedPlanData.title,
        quantity_professionals: selectedPlanData.quantity_professionals,
        remove_ads_client: removeAds,
        amount: formatPrice(priceString)
      }
      const link = await LinkCheckoutMercadoPago(data);
      setPaymentLink(link);
      setIsModalVisible(true);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível processar o pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  // Adicione o Modal antes do return principal
  const PaymentInstructionsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        return null;
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Instruções de Pagamento</Text>

          <Text style={styles.instructionsText}>
            Para realizar o pagamento com sucesso, siga estas instruções:
          </Text>

          <View style={styles.instructionsList}>
            <Text style={styles.instructionItem}>1. Copie o link abaixo</Text>
            <Text style={styles.instructionItem}>2. Abra seu navegador (Chrome, Safari, etc.)</Text>
            <Text style={styles.instructionItem}>3. Cole o link e acesse</Text>
            <Text style={styles.instructionItem}>4. Complete o pagamento no navegador</Text>
            <Text style={[styles.instructionItem, { color: '#f44336' }]}>
              5. Importante: Se caso o link ou o navegador redirecionar para o aplicativo do mercado pago, não continue pelo aplicativo pois, esta gerando um erro na hora de pagar.
            </Text>
          </View>


          <View style={styles.linkContainer}>
            <TextInput
              value={paymentLink}
              style={styles.linkInput}
              multiline
              selectTextOnFocus
            />
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  Clipboard.setString(paymentLink);
                  dispatch(setSnackbar({
                    visible: true,
                    title: 'Link copiado para a área de transferência!',
                  }));
                }}
              >
                <MaterialIcons name="content-copy" size={20} color={theme.colors.primary} />
                <Text style={styles.copyButtonText}>Copiar Link</Text>
              </TouchableOpacity>


              {/* <TouchableOpacity
                style={styles.openButton}
                onPress={() => {
                  Linking.openURL(paymentLink);
                }}
              >
                <MaterialIcons name="open-in-browser" size={20} color={theme.colors.primary} />
                <Text style={styles.copyButtonText}>Abrir no Navegador</Text>
              </TouchableOpacity> */}
            </View>
          </View>

          <View style={styles.postPaymentContainer}>
            <MaterialIcons name="info" size={24} color={theme.colors.primary} />
            <Text style={styles.postPaymentText}>
              Após efetuar o pagamento, retorne para a tela de "Meus planos" para verificar a aprovação do pagamento.
            </Text>
          </View>

          <Button
            mode="outlined"
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            Fechar
          </Button>
        </View>
      </View>
      <AlertSnackbar />

    </Modal>
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <PaymentInstructionsModal />
      <Header title={'Escolha seu plano'} description={`Estabelecimento: ${establishmentName}`} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Desbloqueie todos os recursos premium</Text>
        </View>

        <View style={styles.paymentMethodsContainer}>
          <Text style={styles.paymentMethodTitle}>Método de Pagamento</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentMethodCard,
                paymentMethod === 'pix' && styles.selectedPaymentMethod,
              ]}
              onPress={() => setPaymentMethod('pix')}
            >
              <MaterialIcons name="qr-code" size={24} color={paymentMethod === 'pix' ? theme.colors.primary : '#000'} />
              <Text style={styles.paymentMethodText}>PIX</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethodCard,
                paymentMethod === 'credit_card' && styles.selectedPaymentMethod,
              ]}
              onPress={() => setPaymentMethod('credit_card')}
            >
              <MaterialIcons name="credit-card" size={24} color={paymentMethod === 'credit_card' ? theme.colors.primary : '#000'} />
              <Text style={styles.paymentMethodText}>Cartão de Crédito</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.adsToggleContainer}>
          <TouchableOpacity
            style={[styles.adsToggle, removeAds && styles.adsToggleSelected]}
            onPress={() => setRemoveAds(!removeAds)}
          >
            <MaterialIcons
              name={removeAds ? "check-box" : "check-box-outline-blank"}
              size={24}
              color={removeAds ? theme.colors.primary : '#000'}
            />
            <Text style={styles.adsToggleText}>
              Remover anúncios para clientes (+R$ {paymentPeriod === 'yearly' ? '10,00' : '15,00'})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.periodToggleContainer}>
          <TouchableOpacity
            style={[styles.periodToggle, paymentPeriod === 'monthly' && styles.periodToggleSelected]}
            onPress={() => setPaymentPeriod('monthly')}
          >
            <Text style={[styles.periodToggleText, paymentPeriod === 'monthly' && styles.periodToggleTextSelected]}>
              Mensal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodToggle, paymentPeriod === 'yearly' && styles.periodToggleSelected]}
            onPress={() => setPaymentPeriod('yearly')}
          >
            <Text style={[styles.periodToggleText, paymentPeriod === 'yearly' && styles.periodToggleTextSelected]}>
              Anual
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
              ]}
              onPress={() => handleSelectPlan(plan.id)}
            >
              <Text style={styles.planTitle}>
                {plan.title}
              </Text>
              <Text style={styles.planPrice}>
                {removeAds
                  ? (paymentPeriod === 'yearly'
                    ? (paymentMethod === 'credit_card' ? plan.withAdsRemoval.yearlyCreditPrice : plan.withAdsRemoval.yearlyPixPrice)
                    : (paymentMethod === 'credit_card' ? plan.withAdsRemoval.creditPrice : plan.withAdsRemoval.pixPrice))
                  : (paymentPeriod === 'yearly'
                    ? (paymentMethod === 'credit_card' ? plan.yearlyCreditPrice : plan.yearlyPixPrice)
                    : (paymentMethod === 'credit_card' ? plan.creditPrice : plan.pixPrice))}
                {paymentPeriod === 'yearly' && <Text style={styles.yearlyDiscount}> (Ganhe 1 mês grátis)</Text>}
              </Text>
              <View style={styles.featuresContainer}>
                {(removeAds ? plan.withAdsRemoval.features : plan.features).map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <MaterialIcons name="check-circle" size={20} color={theme.colors.primary} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
                {paymentPeriod === 'yearly' && (
                  <View style={styles.featureRow}>
                    <MaterialIcons name="check-circle" size={20} color={theme.colors.primary} />
                    <Text style={styles.featureText}>Ganhe 1 mês grátis</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          mode="contained"
          loading={isLoading}
          disabled={!selectedPlan || !paymentMethod || isLoading}
          style={[
            styles.paymentButton,
            (!selectedPlan || !paymentMethod || isLoading) && styles.paymentButtonDisabled,
          ]}
          onPress={handlePayment}
        >
          Gerar link de pagamento
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // paddingTop: 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  plansContainer: {
    padding: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedPlan: {
    borderColor: theme.colors.primary,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#000000',
  },
  paymentButton: {
    margin: 10,
  },
  paymentButtonDisabled: {
    opacity: 0.7,
  },
  paymentMethodsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentMethodCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedPaymentMethod: {
    borderColor: theme.colors.primary,
  },
  paymentMethodText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  pixDiscount: {
    fontSize: 14,
    color: '#28a745',
  },
  adsToggleContainer: {
    padding: 16,
    paddingTop: 0,
  },
  adsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  adsToggleSelected: {
    borderColor: theme.colors.primary,
  },
  adsToggleText: {
    fontSize: 14,
    color: '#000000',
  },
  periodToggleContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 8,
  },
  periodToggle: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  periodToggleSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  periodToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  periodToggleTextSelected: {
    color: '#FFFFFF',
  },
  yearlyDiscount: {
    fontSize: 14,
    color: '#28a745',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: theme.colors.primary,
  },
  instructionsText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionsList: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  instructionItem: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  linkContainer: {
    marginVertical: 16,
    width: '100%',
  },
  linkInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    textAlignVertical: 'top',
    color: '#000000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  copyHint: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  closeButton: {
    marginTop: 8,
  },
  postPaymentContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  postPaymentText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    gap: 8,
  },
  openButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    gap: 8,
  },
  copyButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});