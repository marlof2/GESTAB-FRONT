import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import { LocaleConfig } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';

LocaleConfig.locales['pt'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};

LocaleConfig.defaultLocale = 'pt';

const AppointmentsScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const navigation = useNavigation();

  const handleDatePress = (day) => {
    navigation.navigate('ListScheduleDay', { date: day.dateString });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={'Agenda'} showBack={false} />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name="information-outline" size={30} color="orange" />
          <Text style={styles.iconText}>Escolha o dia desejado.</Text>
        </View>
        <Calendar
          onDayPress={handleDatePress}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, activeOpacity: 10, selectedColor: 'rgb(0, 104, 116)' },
          }}
          firstDay={1}
          style={styles.calendar}
        />
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
    padding: 5,
  },
  calendar: {
    borderWidth: 3,
    borderColor: 'rgb(0, 104, 116)',
    height: 350
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  iconText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default AppointmentsScreen;
