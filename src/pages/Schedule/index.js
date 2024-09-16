import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, StyleSheet, Alert, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LocaleConfig } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Button, Chip, Paragraph, Text, Title } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import api from '../../services';
import { useIsFocused } from '@react-navigation/native'
import { AuthContext } from '../../contexts/auth';
import EmptyListMessage from '../../components/Ui/EmptyListMessage';
import { helper } from '../../helpers/inputs';
import { date } from 'yup';

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
  const [itemsCount, setItemsCount] = useState(null);
  const [itemsEstablishment, setItemsEstablishment] = useState([]);
  const [itemsProfessional, setItemsProfessional] = useState([]);
  const [establishimentId, setEstablishimentId] = useState(null);
  const [typeSchedule, setTypeSchedule] = useState(null);
  const [professionalId, setProfessionalId] = useState(null);
  const isFocused = useIsFocused();
  const { user } = useContext(AuthContext);

  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const handleDatePress = (day) => {
    if (establishimentId != null && professionalId != null) {
      setSelectedDate(day.dateString);
      fetchAppointments(day.dateString);
    } else {
      Alert.alert(
        'Atenção!',
        'Para proseguir você deve selecionar o estabelecimento e o profissional desejado.',
        [{ text: 'OK' }],
      );
    }
  };

  const fetchAppointments = async (date) => {
    setLoadingAppointments(true);
    try {
      const response = await api.get(`/list`, {
        params: {
          date: date,
          establishment_id: establishimentId,
          professional_id: professionalId,
        },
      });

      if (response.status === 200) {
        setAppointments(response.data.data);
        setItemsCount(response.data.total)
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error(error);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const help = () => {
    Alert.alert(
      'Para fazer o agendamento.',
      'Selecione o estabelecimento, o profissional e por último a data que você deseja marcar.',
      [{ text: 'OK' }],
    );
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
  const navigateToSchedule = () => {
    let objParams = {}
    if (establishimentId != null && professionalId != null && selectedDate != null) {
      let professional = itemsProfessional.find(el => el.user.id == professionalId)

      objParams = {
        date: selectedDate,
        establishment_id: establishimentId,
        professional_id: professionalId,
        professional_name: professional.user.name,
        user: user.user,
        typeSchedule
      }
      navigation.navigate('ListScheduleDay', objParams);
    } else {
      Alert.alert(
        'Atenção!',
        'Para proseguir você deve selecionar o estabelecimento e o profissional desejado.',
        [{ text: 'OK' }],
      );
    }
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

  const renderFooter = () => {
    if (loadingAppointments) {
      return <ActivityIndicator animating={true} size='small' />;
    }
  };

  const clearDropDown = () => {
    setEstablishimentId(null);
    setProfessionalId(null);
    setItemsEstablishment([]);
    setItemsProfessional([]);
    setSelectedDate(null);
    setAppointments([]);
  };

  useEffect(() => {
    if (isFocused) {
      getEstablisiments();
    } else {
      clearDropDown();
    }

    return () => { };
  }, [isFocused]);

  const getEstablisiments = async () => {
    const response = await api.get(`/combo/establishimentsUser/${user.user.id}`);

    if (response.status == 200) {
      setItemsEstablishment(response.data);
    }
  };

  const getProfessionalByEstablishment = async (establishimentId) => {
    const response = await api.get(`/combo/professionalByEstablishment/${establishimentId}`);

    if (response.status == 200) {
      setItemsProfessional(response.data);
    }
  };

  const description = () => {
    return <Text style={{ textAlign: 'center' }}> <Text style={styles.titleCardContent}>Tipo de agenda: </Text>{typeSchedule == 'HM' ? 'Horário marcado' : 'Ordem de chegada'}</Text>
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={'Filtro de Agenda'} showBack={false} />
      <View style={styles.container}>
        <ScrollView >
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>Clique no ícone para ajuda.</Text>
            <Icon onPress={help} name="help-circle" size={30} color="orange" />
          </View>
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
                getProfessionalByEstablishment(item.establishment_id);
                setProfessionalId(null); // Limpa o profissional selecionado
                setAppointments([]); // Limpa os agendamentos
                setSelectedDate(null); // Limpa a data selecionada
                setIsFocus(false);
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
                setAppointments([]); // Limpa os agendamentos
                setSelectedDate(null); // Limpa a data selecionada
                setIsFocus(false);
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

          <View style={{ margin: 10 }}>
            <Button icon="notebook-outline" mode="contained" onPress={navigateToSchedule}>
              Ir para agenda
            </Button>
          </View>


          <View style={styles.appointmentsContainer}>
            {
              appointments.length > 0 && (
                typeSchedule == 'HM' ? <Text style={{ textAlign: 'center' }} variant="titleLarge">Listagem da Agenda</Text> : <Text style={{ textAlign: 'center' }} variant="titleLarge">Listagem da Fila</Text>
              )
            }
            {
              appointments.length > 0 && (description())
            }


            <FlatList
              data={appointments}
              showsVerticalScrollIndicator
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.appointmentItem}>
                  <Paragraph> <Text style={styles.titleCardContent}>Nome: </Text>{item.user.name}</Paragraph>
                  <Paragraph> <Text style={styles.titleCardContent}>Hora: </Text>{`${helper.formatTime(item.time)}`}</Paragraph>
                  <Paragraph> <Text style={styles.titleCardContent}>Status: </Text>{`${item.status.name}`}</Paragraph>
                </View>
              )}
              contentContainerStyle={{ padding: 5, }}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={<EmptyListMessage count={itemsCount} message="Nenhum resultado encontrado." />}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  calendar: {
    borderRadius: 15, // Para bordas arredondadas
    marginBottom: 10
  },
  calendarContainer: {
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
    marginRight: 5,
    fontSize: 16,
  },
  // Dropdown styles
  containerDropdown: {
    marginBottom: 15,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 15,
    top: -8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#aaa',
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  // Appointments styles
  appointmentsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    marginBottom: 100
  },
  appointmentItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginTop: 10
  },
  appointmentText: {
    fontSize: 16,
  },
  noAppointmentsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  titleCardContent: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default AppointmentsScreen;
