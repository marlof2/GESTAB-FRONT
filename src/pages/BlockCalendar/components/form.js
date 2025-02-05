import React, { useState, useContext, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { RadioButton, Text, Button, Portal, Modal, TextInput, SegmentedButtons, Surface } from 'react-native-paper';
import { AuthContext } from '../../../contexts/auth';
import { getEstablishmentStorage } from '../../../helpers';
import api from '../../../services';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { setSnackbar } from '../../../store/globalSlice';
import { useDispatch } from 'react-redux';
import Snackbar from '../../../components/Ui/Snackbar';
import Header from '../../../components/Header';

export default function BlockCalendar() {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const [selectedDates, setSelectedDates] = useState({});
  const [period, setPeriod] = useState('allday');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [establishment, setEstablishment] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);

  useEffect(() => {
    async function loadEstablishment() {
      const establishmentData = await getEstablishmentStorage();
      setEstablishment(establishmentData);
      loadBlocks();
    }
    loadEstablishment();
  }, []);

  useEffect(() => {
  }, [timeStart, timeEnd]);

  async function loadBlocks() {
    try {
      const response = await api.get('/blockcalendars');
      setBlocks(response.data);
    } catch (error) {
      console.error('Erro ao carregar bloqueios:', error);
    }
  }

  const handleDayPress = (day) => {
    const updatedDates = { ...selectedDates };
    if (updatedDates[day.dateString]) {
      delete updatedDates[day.dateString];
    } else {
      updatedDates[day.dateString] = {
        selected: true,
        selectedColor: '#2196F3'
      };
    }
    setSelectedDates(updatedDates);
  };

  const handleSaveBlock = async () => {
    const dates = Object.keys(selectedDates);
    const blocks = dates.map(date => ({
      establishment_id: establishment?.id,
      user_id: user?.user.id,
      date,
      period,
      time_start: period === 'personalized' ? timeStart : null,
      time_end: period === 'personalized' ? timeEnd : null,
    }));

    try {
      const response = await api.post('/blockcalendars', { blocks });
      if (response.status == 201) {
        dispatch(setSnackbar({ visible: true, title: 'Bloqueio salvo com sucesso!' }));
        setSelectedDates({});
        setPeriod('allday');
        setTimeStart('');
        setTimeEnd('');
        loadBlocks();
      }
    } catch (error) {
      dispatch(setSnackbar({ visible: true, title: 'Erro ao salvar bloqueio!' }));
      console.error('Erro ao salvar bloqueio:', error);
    }
  };

  const validationSchema = Yup.object().shape({
    timeStart: Yup.string()
      .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:mm)')
      .required('Hora inicial é obrigatória'),
    timeEnd: Yup.string()
      .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:mm)')
      .required('Hora final é obrigatória'),
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Novo Bloqueio" subtitle={`Estabelecimento: ${establishment?.name}`} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.calendarCard} elevation={2}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={selectedDates}
            markingType={'multi-dot'}
            style={styles.calendar}
            theme={{
              calendarBackground: 'transparent',
              textSectionTitleColor: '#rgb(0, 103, 131)',
              selectedDayBackgroundColor: '#rgb(0, 103, 131)',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#rgb(0, 103, 131)',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              arrowColor: '#rgb(0, 103, 131)',
            }}
          />
        </Surface>

        <View style={styles.periodContainer}>
          <Text style={styles.sectionTitle}>Período do Bloqueio</Text>
          <View style={styles.segmentedContainer}>
            <View style={styles.segmentedRow}>
              <SegmentedButtons
                value={period}
                onValueChange={setPeriod}
                buttons={[
                  { 
                    value: 'allday', 
                    label: 'Dia Todo',
                    icon: 'calendar-today',
                    showSelectedCheck: true,
                  },
                  { 
                    value: 'morning', 
                    label: 'Manhã',
                    icon: 'weather-sunny',
                    showSelectedCheck: true,
                  },
                ]}
                style={styles.segmentedPair}
                theme={{
                  colors: {
                    primary: '#2196F3',
                    secondaryContainer: '#E3F2FD',
                  },
                }}
              />
            </View>
            <View style={styles.segmentedRow}>
              <SegmentedButtons
                value={period}
                onValueChange={setPeriod}
                buttons={[
                  { 
                    value: 'afternoon', 
                    label: 'Tarde',
                    icon: 'weather-sunset',
                    showSelectedCheck: true,
                  },
                  { 
                    value: 'night', 
                    label: 'Noite',
                    icon: 'weather-night',
                    showSelectedCheck: true,
                  },
                ]}
                style={styles.segmentedPair}
                theme={{
                  colors: {
                    primary: '#2196F3',
                    secondaryContainer: '#E3F2FD',
                  },
                }}
              />
            </View>
            <Button
              mode={period === 'personalized' ? 'contained' : 'outlined'}
              onPress={() => setPeriod('personalized')}
              icon="clock-edit-outline"
              style={styles.personalizedButton}
            >
              Personalizado
            </Button>
          </View>
        </View>

        {period === 'personalized' && (
          <View style={styles.timeContainer}>
            <Button 
              mode="outlined" 
              onPress={() => setIsTimeModalVisible(true)}
              style={styles.timeButton}
            >
              {timeStart && timeEnd 
                ? `${timeStart} - ${timeEnd}`
                : 'Selecionar Horário'}
            </Button>
          </View>
        )}

        <Button 
          mode="contained" 
          onPress={handleSaveBlock}
          style={styles.saveButton}
          disabled={Object.keys(selectedDates).length === 0}
        >
          Salvar Bloqueios
        </Button>
      </ScrollView>

      <Portal>
        <Modal
          visible={isTimeModalVisible}
          onDismiss={() => setIsTimeModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Formik
            initialValues={{ 
              timeStart: timeStart || '', 
              timeEnd: timeEnd || '' 
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setTimeStart(values.timeStart);
              setTimeEnd(values.timeEnd);
              setIsTimeModalVisible(false);
            }}
          >
            {({ values, setFieldValue, handleSubmit, errors }) => (
              <View>
                <TextInput
                  label="Hora inicial"
                  value={values.timeStart}
                  onChangeText={(text) => {
                    // Aplica a máscara HH:mm
                    const formatted = text
                      .replace(/\D/g, '')
                      .replace(/(\d{2})(\d)/, '$1:$2')
                      .replace(/(\d{2})\d+?$/, '$1')
                      .slice(0, 5);
                    
                    // Valida se é uma hora válida
                    if (text.length === 5) {
                      const [hours, minutes] = formatted.split(':');
                      if (parseInt(hours) > 23 || parseInt(minutes) > 59) {
                        return;
                      }
                    }
                    
                    setFieldValue('timeStart', formatted);
                  }}
                  error={!!errors.timeStart}
                  style={styles.timeInput}
                  keyboardType="numeric"
                  placeholder="00:00"
                  maxLength={5}
                  mode="outlined"
                />
                {errors.timeStart && (
                  <Text style={styles.errorText}>{errors.timeStart}</Text>
                )}

                <TextInput
                  label="Hora final"
                  value={values.timeEnd}
                  onChangeText={(text) => {
                    // Aplica a máscara HH:mm
                    const formatted = text
                      .replace(/\D/g, '')
                      .replace(/(\d{2})(\d)/, '$1:$2')
                      .replace(/(\d{2})\d+?$/, '$1')
                      .slice(0, 5);
                    
                    // Valida se é uma hora válida
                    if (text.length === 5) {
                      const [hours, minutes] = formatted.split(':');
                      if (parseInt(hours) > 23 || parseInt(minutes) > 59) {
                        return;
                      }
                    }
                    
                    setFieldValue('timeEnd', formatted);
                  }}
                  error={!!errors.timeEnd}
                  style={styles.timeInput}
                  keyboardType="numeric"
                  placeholder="00:00"
                  maxLength={5}
                  mode="outlined"
                />
                {errors.timeEnd && (
                  <Text style={styles.errorText}>{errors.timeEnd}</Text>
                )}

                <Button 
                  mode="contained" 
                  onPress={handleSubmit}
                  style={styles.modalButton}
                >
                  Confirmar
                </Button>
              </View>
            )}
          </Formik>
        </Modal>
      </Portal>
      <Snackbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10
  },
  errorText: {
    color: 'red',
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 8,
    fontSize: 12,
  },
  modalButton: {
    marginTop: 10,
    borderRadius: 10
  },
  timeButton: {
    minWidth: 200,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendarCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendar: {
    borderRadius: 12,
  },
  periodContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  segmentedContainer: {
    gap: 12,
  },
  segmentedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  segmentedPair: {
    width: '100%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  personalizedButton: {
    marginTop: 5,
    borderRadius: 20,
    width: '100%',
  },
  timeContainer: {
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  saveButton: {
    margin: 16,
  },
  timeInput: {
    marginBottom: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
}); 