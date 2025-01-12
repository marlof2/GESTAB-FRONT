import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkEstablishmentPayment } from '../helpers/checkPayment';
import { useRewardedAd } from '../components/AdsMob/hooks/useRewardedAd';

const PaymentContext = createContext({});

export function PaymentProvider({ children }) {
  const [isPaymentActive, setIsPaymentActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { showAd, isLoading: isAdLoading } = useRewardedAd();

  const checkPayment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return false;
      }

      const status = await checkEstablishmentPayment();
      setIsPaymentActive(status);
      return status;
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentFlow = async () => {
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
        interval = setInterval(checkPayment, 30000);
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
        handlePaymentFlow
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => useContext(PaymentContext); 