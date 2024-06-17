import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet } from 'react-native';
import { Appbar, Searchbar, Card, Title, Paragraph } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';

const AppointmentsScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (selectedDate) {
      // Simulate fetching clients for the selected date
      fetchClients(selectedDate);
    }
  }, [selectedDate]);

  const fetchClients = (date) => {
    // Simulate an API call to fetch clients based on the selected date
    const fetchedClients = [
      { id: '1', name: 'John Doe', time: '10:00 AM' },
      { id: '2', name: 'Jane Smith', time: '11:00 AM' },
      // Add more clients as needed
    ];
    setClients(fetchedClients);
  };

  const handleDatePress = (day) => {
    setSelectedDate(day.dateString);
  };

  const renderClient = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.time}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header>
        <Appbar.Content title="Agendamentos" />
      </Appbar.Header>

      <View style={styles.container}>
        <Calendar
          onDayPress={handleDatePress}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
          }}
          style={styles.calendar}
        />
        <Searchbar
          style={styles.searchbar}
          placeholder="Buscar cliente"
          onChangeText={setSearch}
          value={search}
        />
        <FlatList
          data={clients.filter(client => client.name.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={item => item.id}
          renderItem={renderClient}
          style={styles.list}
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
    padding: 10,
  },
  calendar: {
    marginBottom: 10,
  },
  searchbar: {
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
  },
});

export default AppointmentsScreen;
