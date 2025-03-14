import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkEstablishmentPayment } from '../helpers/checkPayment';
import { useRewardedAd } from '../components/AdsMob/hooks/useRewardedAd';

const PaymentContext = createContext({});

export function PaymentProvider({ children }) {
  const [isPaymentActive, setIsPaymentActive] = useState(true);
  const [userInPlan, setUserInPlan] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { showAd, isLoading: isAdLoading } = useRewardedAd();


  const getUser = async () => {
    const user = await AsyncStorage.getItem('user');
    return JSON.parse(user);
  }

  const checkPayment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return false;
      }

      const user = await getUser();
      const data = await checkEstablishmentPayment(user.user.id);
      setIsPaymentActive(data.isActive);
      setUserInPlan(data.userInPlan);
      return data.isActive;
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const RewardedAd = async () => {
    const hasValidPayment = await checkPayment();
    if (!hasValidPayment && !isAdLoading) {
      await showAd();
    }
    return true;
  };

  useEffect(() => {
    let interval;
    
    const startInterval = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        checkPayment();
        // 12 horas em milissegundos = 12 * 60 * 60 * 1000 = 43200000
        interval = setInterval(checkPayment, 43200000); // 12 horas
      }
    };

    startInterval();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <PaymentContext.Provider 
      value={{ 
        isPaymentActive, 
        isLoading, 
        checkPayment,
        RewardedAd,
        userInPlan,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => useContext(PaymentContext); 