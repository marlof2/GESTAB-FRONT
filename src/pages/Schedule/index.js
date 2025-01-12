import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Header from '../../components/Header';


import { useNavigation } from '@react-navigation/native';
import api from '../../services';
import { useIsFocused } from '@react-navigation/native'
import { AuthContext } from '../../contexts/auth';
import Dropdown from '../../components/Ui/Input/Dropdown';
import LocaleConfigPt from '../../util/calendar/LocaleConfigPt';
import { Card } from 'react-native-paper';
import { BannerAdComponent } from '../../components/AdsMob/components/BannerAdComponent';
import { useRewardedAd } from '../../components/AdsMob/hooks/useRewardedAd';
import { checkEstablishmentPayment } from '../../helpers/checkPayment';
import { getEstablishment } from '../../helpers';
import { usePayment } from '../../contexts/PaymentContext';

LocaleConfigPt

const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const [isFocus, setIsFocus] = useState(false);
  const [itemsEstablishment, setItemsEstablishment] = useState([])
  const [itemsProfessional, setItemsProfessional] = useState([])
  const [establishimentId, setEstablishimentId] = useState(null)
  const [typeSchedule, setTypeSchedule] = useState(null)
  const [professionalId, setProfessionalId] = useState(null)
  const isFocused = useIsFocused()
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const { RewardedAd } = usePayment();


  const handleDatePress = async (day) => {
    if (!establishimentId || !professionalId) {
      return Alert.alert(
        'Atenção!',
        'Para proseguir você deve selecionar o estabelecimento e o profissional desejado.',
        [{ text: 'OK' }],
      );
    }

    await RewardedAd();
    setSelectedDate(day.dateString);
    
    const professional = itemsProfessional.find(el => el.user.id == professionalId);
    const objParams = {
      date: day.dateString,
      establishment_id: establishimentId,
      professional_id: professionalId,
      professional_name: professional.user.name,
      user: user.user,
      typeSchedule
    };
    
    navigation.navigate('ListScheduleDay', objParams);
  };


  const clearDropDown = () => {
    setEstablishimentId(null)
    setProfessionalId(null)
    setItemsEstablishment([])
    setItemsProfessional([])
  }

  const setEstablishmentId = async () => {
    const establishment = await getEstablishment();
    setEstablishimentId(establishment.id);
    getProfessionalByEstablishment(establishment.id);
  }


  useEffect(() => {
    if (isFocused) {
      getEstablisiments()
      setEstablishmentId()
    } else {
      clearDropDown()
    }

    return () => {

    }

  }, [isFocused])


  const getEstablisiments = async () => {
    const response = await api.get(`/combo/establishimentsUser/${user.user.id}`)

    if (response.status == 200) {
      setItemsEstablishment(response.data);
    }
  }

  const getProfessionalByEstablishment = async (establishimentId) => {
    const response = await api.get(`/combo/professionalByEstablishment/${establishimentId}`)

    if (response.status == 200) {
      setItemsProfessional(response.data);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={'Filtro de Agenda'} showBack={false} />
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.formContainer}>
            <Dropdown
              disable={true}
              label="Estabelecimento"
              data={itemsEstablishment}
              placeholder="Selecione o estabelecimento"
              value={establishimentId}
              onChange={(item) => {
                if (item) {
                  setEstablishimentId(item.establishment_id);
                  // getProfessionalByEstablishment(item.establishment_id);
                  setSelectedDate(null);
                } else {
                  setEstablishimentId(null);
                }
              }}
              labelField="establishments.name"
              valueField="establishments.id"
            />

            <Dropdown
              style={styles.dropdown}
              label="Profissional"
              data={itemsProfessional}
              placeholder="Selecione o profissional"
              value={professionalId}
              onChange={(item) => {
                if (item) {
                  setProfessionalId(item.user_id);
                  setTypeSchedule(item.user.type_schedule);
                  setIsFocus(false);
                  setSelectedDate(null);
                } else {
                  setProfessionalId(null);
                }
              }}
              labelField="user.name"
              valueField="user.id"
            />
          </View>

          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDatePress}
              markedDates={{
                [selectedDate]: { selected: true, marked: true, selectedColor: 'rgb(0, 104, 116)' },
              }}
              firstDay={1}
              style={styles.calendar}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: 'rgb(0, 104, 116)',
                selectedDayBackgroundColor: 'rgb(0, 104, 116)',
                selectedDayTextColor: '#ffffff',
                todayTextColor: 'rgb(0, 104, 116)',
                dayTextColor: '#2d4150',
                arrowColor: 'rgb(0, 104, 116)',
              }}
            />
          </View>
        </Card>
      </View>
      <BannerAdComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formContainer: {
    gap: 16,
    marginBottom: 24,
  },
  calendarContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  calendar: {
    borderRadius: 16,
  },
});

export default AppointmentsScreen;
