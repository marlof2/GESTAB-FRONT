import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import { LocaleConfig } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import api from '../../services';
import { useIsFocused } from '@react-navigation/native'
import { AuthContext } from '../../contexts/auth';

LocaleConfig.locales['pt'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};

LocaleConfig.defaultLocale = 'pt';

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


  const renderLabelEstablishment = () => {
    if (establishimentId || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'rgb(0, 104, 116)' }]}>
          Estabelecimento
        </Text>
      );
    }
    return null;
  };

  const renderLabelProfessional = () => {
    if (professionalId || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'rgb(0, 104, 116)' }]}>
          Profissional
        </Text>
      );
    }
    return null;
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
        {/* <View style={styles.iconContainer}>
          <Icon name="information-outline" size={30} color="orange" />
          <Text style={styles.iconText}>Escolha o estabelecimento e o dia desejado.</Text>
        </View> */}
        <View style={styles.containerDropdown}>
          {renderLabelEstablishment()}
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'rgb(0, 104, 116)' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={itemsEstablishment}
            search
            maxHeight={300}
            labelField="establishments.name"
            valueField="establishments.id"
            placeholder={'Selecione o estabelecimento'}
            searchPlaceholder="Pesquisar..."
            value={establishimentId}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setEstablishimentId(item.establishment_id);
              getProfessionalByEstablishment(item.establishment_id)
              setIsFocus(false);
              setSelectedDate(null); // Limpa a data selecionada
            }}
          />
        </View>
        <View style={styles.containerDropdown}>
          {renderLabelProfessional()}
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'rgb(0, 104, 116)' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={itemsProfessional}
            search
            maxHeight={300}
            labelField="user.name"
            valueField="user.id"
            placeholder={'Selecione o profissional'}
            searchPlaceholder="Pesquisar..."
            value={professionalId}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setProfessionalId(item.user_id);
              setTypeSchedule(item.user.type_schedule);
              setIsFocus(false);
              setSelectedDate(null); // Limpa a data selecionada
            }}
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
    padding: 16,
  },
  calendar: {
    borderRadius: 15, // Para bordas arredondadas
    marginBottom: 10,
  },
  calendarContainer: {
    marginTop: 30,
    borderWidth: 2,
    borderColor: 'rgb(0, 104, 116)',
    borderRadius: 15, // Para bordas arredondadas
    backgroundColor: '#fff', // Necessário para que a sombra seja visível
    elevation: 5, // Elevação para Android
    shadowColor: '#000', // Cor da sombra para iOS
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra para iOS
    shadowOpacity: 0.25, // Opacidade da sombra para iOS
    shadowRadius: 3.84, // Raio da sombra para iOS
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


  //dropdown
  containerDropdown: {
    marginBottom: 10
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
    top: 15
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 15,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 8,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default AppointmentsScreen;
