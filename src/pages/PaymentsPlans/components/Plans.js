import { useContext, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CheckoutMercadoPago from '../../../services/paymentService/checkoutMercadoPago';
import { AuthContext } from '../../../contexts/auth';
import Header from '../../../components/Header';
import api from "../../../services";

export default function PaymentPlans({ route }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const { user } = useContext(AuthContext)

  const { establishmentId, establishmentName } = route.params;
  const plans = [
    {
      id: 1,
      title: 'Plano Mensal',
      pixPrice: 'R$ 29,99',
      creditPrice: 'R$ 31,50',
      features: ['Acesso ilimitado', 'Suporte prioritário', 'Sem anúncios'],
    },
    {
      id: 2,
      title: 'Plano Anual',
      pixPrice: 'R$ 299,99',
      creditPrice: 'R$ 397,99',
      features: ['Acesso ilimitado', 'Suporte prioritário', 'Sem anúncios', '2 meses grátis'],
    },
  ];

  function handleSelectPlan(planId) {
    setSelectedPlan(planId);
  }

  async function checkActivePayment(establishmentId, userId) {
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
    const hasActive = await checkActivePayment(establishmentId, user.user.id);
    if (hasActive) {
      Alert.alert('Atenção', 'Você já possui um plano ativo para este estabelecimento.');
      return;
    }

    // Proceed with checkout if no active payment
    await CheckoutMercadoPago({
      payment_method: paymentMethod,
      user_id: user.user.id,
      plan_id: selectedPlan,
      establishment_id: establishmentId
    });
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
              <MaterialIcons name="qr-code" size={24} color={paymentMethod === 'pix' ? '#007AFF' : '#000'} />
              <Text style={styles.paymentMethodText}>PIX</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethodCard,
                paymentMethod === 'credit_card' && styles.selectedPaymentMethod,
              ]}
              onPress={() => setPaymentMethod('credit_card')}
            >
              <MaterialIcons name="credit-card" size={24} color={paymentMethod === 'credit_card' ? '#007AFF' : '#000'} />
              <Text style={styles.paymentMethodText}>Cartão de Crédito</Text>
            </TouchableOpacity>
          </View>
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
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planPrice}>
                {paymentMethod === 'credit_card' ? plan.creditPrice : plan.pixPrice}
                {paymentMethod === 'pix' && <Text style={styles.pixDiscount}> (PIX)</Text>}
              </Text>
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <MaterialIcons name="check-circle" size={20} color="#007AFF" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
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
          <Text style={styles.paymentButtonText}>Continuar</Text>
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
    borderColor: '#007AFF',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
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
    backgroundColor: '#007AFF',
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
    borderColor: '#007AFF',
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
});