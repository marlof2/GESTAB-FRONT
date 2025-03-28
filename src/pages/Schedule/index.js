import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, StyleSheet, Alert, Text, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Header from '../../components/Header';


import { useNavigation } from '@react-navigation/native';
import api from '../../services';
import { useIsFocused } from '@react-navigation/native'
import { AuthContext } from '../../contexts/auth';
import Dropdown from '../../components/Ui/Input/Dropdown';
import LocaleConfigPt from '../../util/calendar/LocaleConfigPt';
import { Card, Button } from 'react-native-paper';
import { BannerAdComponent } from '../../components/AdsMob/components/BannerAdComponent';
import { getEstablishmentStorage } from '../../helpers';
import { usePayment } from '../../contexts/PaymentContext';
import moment from 'moment/moment';

LocaleConfigPt

const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const [itemsEstablishment, setItemsEstablishment] = useState([])
  const [itemsProfessional, setItemsProfessional] = useState([])
  const [establishimentId, setEstablishimentId] = useState(null)
  const [typeSchedule, setTypeSchedule] = useState(null)
  const [professionalId, setProfessionalId] = useState(null)
  const isFocused = useIsFocused()
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const { RewardedAd } = usePayment();
  const [blocks, setBlocks] = useState([])
  const [markedDates, setMarkedDates] = useState({});
  const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM'));

  const periodTranslation = {
    allday: 'Dia Todo',
    morning: 'Manhã',
    afternoon: 'Tarde',
    night: 'Noite'
  };

  const periodColors = {
    allday: '#F44336',
    morning: '#4CAF50',
    afternoon: '#2196F3',
    night: '#9C27B0'
  };

  const handleDatePress = (day) => {
    if (!establishimentId || !professionalId) {
      return Alert.alert(
        'Atenção!',
        'Para proseguir você deve selecionar o estabelecimento e o profissional desejado.',
        [{ text: 'OK' }],
      );
    }
    setSelectedDate(day.dateString);

    // Atualiza os markedDates com a nova seleção
    const newMarkedDates = {};
    blocks.forEach(block => {
      const dotColors = {
        allday: { key: 'allday', color: '#F44336', selectedDotColor: '#F44336' },
        morning: { key: 'morning', color: '#4CAF50', selectedDotColor: '#4CAF50' },
        afternoon: { key: 'afternoon', color: '#2196F3', selectedDotColor: '#2196F3' },
        night: { key: 'night', color: '#9C27B0', selectedDotColor: '#9C27B0' }
      };

      const timeInfo = block.time_start && block.time_end ?
        `${block.time_start.substring(0, 5)} - ${block.time_end.substring(0, 5)}` :
        '';

      newMarkedDates[block.date] = {
        dots: [{
          ...dotColors[block.period],
          timeInfo
        }],
        disabled: block.period === 'allday',
        disableTouchEvent: block.period === 'allday'
      };
    });

    // Adiciona a marcação para o novo dia selecionado
    newMarkedDates[day.dateString] = {
      ...newMarkedDates[day.dateString],
      selected: true,
      selectedColor: 'rgb(0, 104, 116)'
    };

    setMarkedDates(newMarkedDates);
  };

  const handleNavigateToSchedule = async () => {
    if (!selectedDate) {
      return Alert.alert(
        'Atenção!',
        'Por favor, selecione uma data para continuar.',
        [{ text: 'OK' }],
      );
    }

    await RewardedAd();
    const professional = itemsProfessional.find(el => el.user.id == professionalId);
    const establishmentUser = itemsEstablishment.find(el => el.establishment_id == establishimentId);

    // Encontrar o bloco para a data selecionada
    const selectedBlock = blocks.find(block => block.date === selectedDate);

    const objParams = {
      date: selectedDate,
      establishment_id: establishimentId,
      professional_id: professionalId,
      professional_name: professional.user.name,
      user: user.user,
      typeSchedule,
      block_calendar_id: selectedBlock?.id || null,
      client_can_schedule: establishmentUser.establishments.client_can_schedule
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
    const establishment = await getEstablishmentStorage();
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
      setMarkedDates({});
      setBlocks([]);
      setSelectedDate(null);
    }

  }, [isFocused])


  const processBlockedDates = (blocks) => {
    const newMarkedDates = {};

    blocks.forEach(block => {
      const dotColors = {
        allday: { key: 'allday', color: '#F44336', selectedDotColor: '#F44336' },
        morning: { key: 'morning', color: '#4CAF50', selectedDotColor: '#4CAF50' },
        afternoon: { key: 'afternoon', color: '#2196F3', selectedDotColor: '#2196F3' },
        night: { key: 'night', color: '#9C27B0', selectedDotColor: '#9C27B0' }
      };

      const timeInfo = block.time_start && block.time_end ?
        `${block.time_start.substring(0, 5)} - ${block.time_end.substring(0, 5)}` :
        '';

      newMarkedDates[block.date] = {
        dots: [{
          ...dotColors[block.period],
          timeInfo
        }],
        disabled: block.period === 'allday',
        disableTouchEvent: block.period === 'allday'
      };
    });

    if (selectedDate) {
      newMarkedDates[selectedDate] = {
        ...newMarkedDates[selectedDate],
        selected: true,
        selectedColor: 'rgb(0, 104, 116)'
      };
    }

    setMarkedDates(newMarkedDates);
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(month.dateString.substring(0, 7)); // Formato YYYY-MM
    if (establishimentId && professionalId) {
      getBlockCalendarByEstablishmentAndUser(establishimentId, professionalId, month.dateString.substring(0, 7));
    }
  };

  const getBlockCalendarByEstablishmentAndUser = async (establishmentId, professionalId, month = currentMonth) => {
    const response = await api.get('/blockcalendars/getBlockCalendarByEstablishmentAndUser', {
      params: {
        establishmentId,
        professionalId,
        month
      }
    });

    if (response.status == 200) {
      setBlocks(response.data);
      processBlockedDates(response.data);
    }
  };

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

      // Se houver apenas um profissional, seleciona-o automaticamente
      if (response.data.length === 1) {
        const professional = response.data[0];
        setProfessionalId(professional.user_id);
        getBlockCalendarByEstablishmentAndUser(establishimentId, professional.user_id);
        setTypeSchedule(professional.user.type_schedule);
        setSelectedDate(null);
      }
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={'📅 Filtro de Agenda'} subtitle={'Selecione o profissional e a data para filtrar a agenda.'} showBack={false} />
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                  label="Profissional"
                  data={itemsProfessional}
                  placeholder="Selecione o profissional"
                  value={professionalId}
                  onChange={(item) => {
                    if (item) {
                      setProfessionalId(item.user_id);
                      getBlockCalendarByEstablishmentAndUser(establishimentId, item.user_id);
                      setTypeSchedule(item.user.type_schedule);
                      setSelectedDate(null);
                    } else {
                      setProfessionalId(null);
                      setBlocks([]);
                      setMarkedDates({});
                    }
                  }}
                  labelField="user.name"
                  valueField="user.id"
                />
              </View>

              {blocks.length > 0 && (
                <>
                  <View style={styles.blockedTimesContainer}>
                    <Text style={styles.blockedTimesTitle}>Agenda com dias bloqueados</Text>

                    {blocks.map((block, index) => (
                      <View key={index} style={styles.blockedTimeRow}>
                        <View style={[styles.periodDot, { backgroundColor: periodColors[block.period] }]} />
                        <Text style={styles.blockedTimeText}>
                          {`${periodTranslation[block.period]} - ${block.time_start && block.time_end
                              ? `${block.time_start.substring(0, 5)} - ${block.time_end.substring(0, 5)}`
                              : ''
                            }`}
                        </Text>
                      </View>
                    ))}


                    {/* <View style={styles.legendContainer}>
                      <View style={styles.legendItem}>
                        <Text style={styles.legendItem}>Legenda:</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
                        <Text style={styles.legendText}>Dia Todo</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
                        <Text style={styles.legendText}>Manhã</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: '#2196F3' }]} />
                        <Text style={styles.legendText}>Tarde</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: '#9C27B0' }]} />
                        <Text style={styles.legendText}>Noite</Text>
                      </View>
                    </View> */}
                  </View>
                </>
              )}
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={handleDatePress}
                  onMonthChange={handleMonthChange}
                  markedDates={markedDates}
                  firstDay={1}
                  style={styles.calendar}
                  markingType={'multi-dot'}
                  minDate={moment().format('YYYY-MM-DD')}
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

              <Card.Actions style={styles.cardActions}>
                <Button
                  mode="contained"
                  onPress={handleNavigateToSchedule}
                  style={styles.scheduleButton}
                  disabled={!selectedDate}
                  icon="calendar-check"
                >
                  Ir para agenda
                </Button>
              </Card.Actions>
            </Card>
          </View>
        </ScrollView>
        <View style={styles.bannerContainer}>
          <BannerAdComponent />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 60,
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
    marginBottom: 24,
  },
  calendarContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  calendar: {
    borderRadius: 16,
  },
  blockedTimesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginVertical: 8,
    marginLeft: 10,
    marginBottom: 15
  },
  blockedTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 10
  },
  periodDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  blockedTimeText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  cardActions: {
    justifyContent: 'center',
    padding: 16,
  },
  scheduleButton: {
    borderRadius: 10,
    padding: 2,
    width: '100%',
  },
  blockedTimesContainer: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    fontWeight: 'bold',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
  },
});

export default AppointmentsScreen;
