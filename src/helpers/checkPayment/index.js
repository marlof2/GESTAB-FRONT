import api from "../../services";
import { getEstablishmentStorage } from "../../helpers";

/**
 * Verifica se o estabelecimento está com o pagamento ativo
 * @returns {Promise<boolean>} - Retorna true se o pagamento estiver ativo, false caso contrário

 */
export async function checkEstablishmentPayment() {
  try {
    // Busca o ID do estabelecimento no AsyncStorage
    const establishment = await getEstablishmentStorage()

    if (!establishment) {
      return false;
    }

    // Busca os dados do estabelecimento na API
    const response = await api.get(`/establishments/checkPaymentActive/${establishment?.id}`);
    // Garante que o retorno seja um booleano
    return response.data.isActive;


  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    return false;
  }
}

