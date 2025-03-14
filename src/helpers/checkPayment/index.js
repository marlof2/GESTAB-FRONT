import api from "../../services";
import { getEstablishmentStorage } from "../../helpers";

/**
 * Verifica se o estabelecimento está com o pagamento ativo
 * @param {string} userId - ID do usuário
 * @returns {Promise<boolean>} - Retorna true se o pagamento estiver ativo, false caso contrário
 */
export async function checkEstablishmentPayment(userId) {
  try {
    // Busca o ID do estabelecimento no AsyncStorage
    const establishment = await getEstablishmentStorage();

    if (!establishment) {
      return false;
    }

    // Busca os dados do estabelecimento na API
    const response = await api.get(`/establishments/checkPaymentActive/${establishment?.id}/${userId}`);
    // Garante que o retorno seja um booleano
    return response.data;

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    return false;
  }
}

