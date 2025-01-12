import api from "../../services";
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Verifica se o estabelecimento está com o pagamento ativo
 * @returns {Promise<boolean>} - Retorna true se o pagamento estiver ativo, false caso contrário
 */
export async function checkEstablishmentPayment() {
  try {
    // Busca o ID do estabelecimento no AsyncStorage
    const establishmentIdLogged = await AsyncStorage.getItem('establishmentIdLogged');
    const establishment = JSON.parse(establishmentIdLogged);
    // Busca os dados do estabelecimento na API
    const response = await api.get(`/establishments/checkPaymentActive/${establishment?.id}`);
    // Garante que o retorno seja um booleano
    return response.data.isActive;
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    return false;
  }
}

