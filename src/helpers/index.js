import AsyncStorage from '@react-native-async-storage/async-storage';

 const getEstablishmentStorage = async () => {
    const establishmentIdLogged = await AsyncStorage.getItem('establishmentIdLogged');
    const establishment = JSON.parse(establishmentIdLogged);  

    if (establishment) {
      return establishment;
    }   
    
    return null;
  }

  export { getEstablishmentStorage };