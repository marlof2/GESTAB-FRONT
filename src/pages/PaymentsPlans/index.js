import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import api from "../../services";
import { Button, Card, SegmentedButtons } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { format, isBefore, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useIsFocused } from '@react-navigation/native';

export default function EstablishmentInfo({ route }) {
  const [activeSegment, setActiveSegment] = useState('active');
  const navigation = useNavigation();
  const [establishmentInfo, setEstablishmentInfo] = useState(null);
  const { establishmentId, establishmentName } = route.params;
  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadEstablishmentInfo() {
      try {
        const response = await api.get(`/establishments/${establishmentId}`);
        setEstablishmentInfo(response.data);
      } catch (error) {
        console.error('Error loading establishment info:', error);
      }
    }

    if (isFocused) {
      loadEstablishmentInfo();
    }
  }, [establishmentId, isFocused]);

  const handleSubscribe = () => {
    navigation.navigate('Plans', {
      establishmentId,
      establishmentName,
    });
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const renderPaymentStatus = (payment) => {
    if (!payment) return null;

    const isExpired = isBefore(endOfDay(new Date(payment.subscription_end)), new Date());

    return (
      <Card style={styles.paymentCard}>
        <Card.Content>
          <View style={styles.statusHeader}>
            <MaterialIcons 
              name={isExpired ? "error" : "check-circle"} 
              size={24} 
              color={isExpired ? "#dc3545" : "#28a745"} 
            />
            <Text style={[
              styles.statusText,
              { color: isExpired ? "#dc3545" : "#28a745" }
            ]}>
              {isExpired ? 'Assinatura Vencida' : 'Assinatura Ativa'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Plano:</Text>
            <Text style={styles.value}>
              {payment.period === 'monthly' ? 'Mensal' : 'Anual'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Método:</Text>
            <Text style={styles.value}>
              {payment.payment_method === 'pix' ? 'PIX' : 'Cartão de Crédito'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Valor:</Text>
            <Text style={styles.value}>
              R$ {parseFloat(payment.amount).toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={{fontSize: 16, color: '#666'}}>Quantidade de profissionais:</Text>
            <Text style={styles.value}>
              {payment.quantity_professionals}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={{fontSize: 16, color: '#666'}}>Remover anúncios para clientes:</Text>
            <Text style={styles.value}>
              {payment.remove_ads_client ? 'Sim' : 'Não'}
            </Text>
          </View>

          <View style={styles.dateContainer}>
            <View style={styles.dateRow}>
              <MaterialIcons name="event" size={20} color="#666" />
              <Text style={styles.dateLabel}>Início:</Text>
              <Text style={styles.dateValue}>
                {formatDate(payment.subscription_start)}
              </Text>
            </View>
            <View style={styles.dateRow}>
              <MaterialIcons name="event" size={20} color="#666" />
              <Text style={styles.dateLabel}>Término:</Text>
              <Text style={styles.dateValue}>
                {formatDate(payment.subscription_end)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderNoSubscriptionWarning = () => (
    <Card style={styles.warningCard}>
      <Card.Content>
        <View style={styles.warningHeader}>
          <MaterialIcons 
            name="warning" 
            size={24} 
            color="#ffc107" 
          />
          <Text style={styles.warningTitle}>Sem assinatura ativa</Text>
        </View>
        <Text style={styles.warningText}>
          Você ainda não possui uma assinatura para este estabelecimento. 
          Assine agora para ter acesso a todos os recursos!
        </Text>
        <Button
          style={styles.button}
          mode="contained"
          icon="credit-card"
          onPress={handleSubscribe}
        >
          Ver Planos
        </Button>
      </Card.Content>
    </Card>
  );

  const renderPaymentHistoryItem = (payment) => {
    const isExpired = isBefore(endOfDay(new Date(payment.subscription_end)), new Date());

    return (
      <Card style={styles.historyCard} key={payment.id}>
        <Card.Content>
          <View style={styles.historyHeader}>
            <MaterialIcons 
              name={isExpired ? "error" : "check-circle"} 
              size={24} 
              color={isExpired ? "#dc3545" : "#28a745"} 
            />
            <Text style={[
              styles.statusText,
              { color: isExpired ? "#dc3545" : "#28a745" }
            ]}>
              {isExpired ? 'Assinatura Vencida' : 'Assinatura Ativa'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Plano:</Text>
            <Text style={styles.value}>
              {payment.period === 'monthly' ? 'Mensal' : 'Anual'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Método:</Text>
            <Text style={styles.value}>
              {payment.payment_method === 'pix' ? 'PIX' : 'Cartão de Crédito'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Valor:</Text>
            <Text style={styles.value}>
              R$ {parseFloat(payment.amount).toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={{fontSize: 16, color: '#666'}}>Quantidade de profissionais:</Text>
            <Text style={styles.value}>
              {payment.quantity_professionals}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={{fontSize: 16, color: '#666'}}>Remover anúncios para clientes:</Text>
            <Text style={styles.value}>
              {payment.remove_ads_client ? 'Sim' : 'Não'}
            </Text>
          </View>


          <View style={styles.dateContainer}>
            <View style={styles.dateRow}>
              <MaterialIcons name="event" size={20} color="#666" />
              <Text style={styles.dateLabel}>Início:</Text>
              <Text style={styles.dateValue}>
                {formatDate(payment.subscription_start)}
              </Text>
            </View>
            <View style={styles.dateRow}>
              <MaterialIcons name="event" size={20} color="#666" />
              <Text style={styles.dateLabel}>Término:</Text>
              <Text style={styles.dateValue}>
                {formatDate(payment.subscription_end)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const ActivePlanTab = () => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {establishmentInfo && (
        <View style={styles.container}>
          {establishmentInfo.payment ? (
            renderPaymentStatus(establishmentInfo.payment)
          ) : (
            renderNoSubscriptionWarning()
          )}
        </View>
      )}
    </ScrollView>
  );

  const PaymentHistoryTab = () => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {establishmentInfo?.payments?.length > 0 ? (
          establishmentInfo.payments.map(payment => renderPaymentHistoryItem(payment))
        ) : (
          <Card style={styles.warningCard}>
            <Card.Content>
              <View style={styles.warningHeader}>
                <MaterialIcons name="info" size={24} color="#666" />
                <Text style={[styles.warningTitle, { color: '#666' }]}>
                  Nenhum histórico encontrado
                </Text>
              </View>
              <Text style={styles.warningText}>
                Não há histórico de pagamentos para este estabelecimento.
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <Header 
        title='Informações do plano'
        description={establishmentName}  
      />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <SegmentedButtons
            style={styles.segmentedButtons}
            value={activeSegment}
            onValueChange={setActiveSegment}
            buttons={[
              {
                value: 'active',
                label: 'Plano Ativo',
                icon: 'credit-card',
                style: { borderRadius: 10 }
              },
              {
                value: 'history',
                label: 'Histórico',
                icon: 'history',
                style: { borderRadius: 10 }
              },
            ]}
          />
          
          {activeSegment === 'active' ? <ActivePlanTab /> : <PaymentHistoryTab />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 16,
  },
  button: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  paymentCard: {
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
    width: 80,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dateContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    width: 60,
  },
  dateValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  warningCard: {
    elevation: 2,
    backgroundColor: '#fff8e1',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffc107',
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 4,
  },
  tabView: {
    flex: 1,
  },
  historyCard: {
    marginBottom: 16,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
});