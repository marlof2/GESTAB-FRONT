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

  const handleDatePress = (day) => {
    if (establishimentId != null && professionalId != null) {
      setSelectedDate(day.dateString);
      let professional = itemsProfessional.find(el => el.user.id == professionalId)

      const objParams = {
        date: day.dateString,
        establishment_id: establishimentId,
        professional_id: professionalId,
        professional_name: professional.user.name,
        user: user.user,
        typeSchedule
      }
      navigation.navigate('ListScheduleDay', objParams);
    } else {
      return Alert.alert(
        'Atenção!',
        'Para proseguir você deve selecionar o estabelecimento e o profissional desejado.',
        [
          { text: 'OK' },
        ],

      );
    }


  };


  const clearDropDown = () => {
    setEstablishimentId(null)
    setProfessionalId(null)
    setItemsEstablishment([])
    setItemsProfessional([])
  }


  useEffect(() => {
    if (isFocused) {
      getEstablisiments()
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
        <Card style={{ padding: 10 }}>
          <View style={styles.containerDropdown}>
            <Dropdown
              label="Estabelecimento"
              data={itemsEstablishment}
              placeholder="Selecione o estabelecimento"
              value={establishimentId}
              onChange={(item) => {
                if (item) {
                  setEstablishimentId(item.establishment_id);
                  getProfessionalByEstablishment(item.establishment_id);
                  setSelectedDate(null);
                } else {
                  setEstablishimentId(null);
                }
              }}
              labelField="establishments.name"
              valueField="establishments.id"
            />

            <Dropdown
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
            />
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent:'center'
  },
  calendar: {
    borderRadius: 15, // Para bordas arredondadas
    marginBottom: 10,
  },
  calendarContainer: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'rgb(0, 104, 116)',
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: 'rgb(0, 104, 116)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  iconText: {
    marginLeft: 10,
    fontSize: 16,
  },

});

export default AppointmentsScreen;
