import AsyncStorage from '@react-native-async-storage/async-storage';

 const getEstablishment = async () => {
    const establishmentIdLogged = await AsyncStorage.getItem('establishmentIdLogged');
    const establishment = JSON.parse(establishmentIdLogged);

    if (establishment) {
      return establishment;
    }
    
    return null;
  }

  export { getEstablishment };