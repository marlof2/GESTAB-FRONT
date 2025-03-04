import { useContext, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import CheckoutMercadoPago from '../../../services/paymentService/checkoutMercadoPago';
import { AuthContext } from '../../../contexts/auth';
import Header from '../../../components/Header';
import api from "../../../services";
import theme from '../../../themes/theme.json';
export default function PaymentPlans({ route }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const { user } = useContext(AuthContext)

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
    await CheckoutMercadoPago(data);
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
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

        <TouchableOpacity
          style={[
            styles.paymentButton,
            (!selectedPlan || !paymentMethod) && styles.paymentButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!selectedPlan || !paymentMethod}
        >
          <Text style={styles.paymentButtonText}>Ir para o pagamento</Text>
        </TouchableOpacity>
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
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
  },
  paymentButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
});