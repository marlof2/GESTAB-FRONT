import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, StyleSheet, Alert, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Header from '../../components/Header';
import Overlay from '../../components/Ui/Overlay';
import api from '../../services';

import { LocaleConfig } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Text, Button, Card, Icon, Divider } from 'react-native-paper'; // Importação do Button
import { Dropdown } from 'react-native-element-dropdown';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import EmptyListMessage from '../../components/Ui/EmptyListMessage';
import RenderItem from './components/RenderItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};

LocaleConfig.defaultLocale = 'pt';

const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const [isFocus, setIsFocus] = useState(false);
  const [itemsEstablishment, setItemsEstablishment] = useState([]);
  const [itemsProfessional, setItemsProfessional] = useState([]);
  const [itemsService, setItemsService] = useState([]);
  const [establishimentId, setEstablishimentId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [professionalId, setProfessionalId] = useState(null);
  const isFocused = useIsFocused();
  const { user } = useContext(AuthContext);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [responsibleId, setResponsibleId] = useState(null);
  const dataUser = user.user;
  const [showReport, setShowReport] = useState(false); // Estado para controlar a exibição do relatório
  const [loading, setLoading] = useState(false);
  const [itemsExportReport, setItemsExportReport] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [itemsCount, setItemsCount] = useState(null);
  const [dataSendExport, setDataSendExport] = useState({});
  const [totalAmount, setTotalAmount] = useState(null);

  const handleDatePress = day => {
    if (establishimentId != null) {
      if (!startDate || (startDate && endDate)) {
        // Definir a data de início
        setStartDate(day.dateString);
        setEndDate(null); // Limpar a data de fim ao selecionar um novo início
        setMarkedDates({
          [day.dateString]: { selected: true, startingDay: true, color: 'rgb(0, 104, 116)' },
        });
      } else if (!endDate) {
        // Comparar datas como strings
        if (day.dateString < startDate) {
          // Não faz nada se a data for anterior à data de início
          return;
        }

        // Definir a data de fim
        setEndDate(day.dateString);

        // Marcar o intervalo de datas
        const range = getDateRange(startDate, day.dateString);
        const newMarkedDates = {};
        range.forEach(date => {
          newMarkedDates[date] = { selected: true, color: '#66B3BA', textColor: 'white' };
        });

        // Marcar a data de início e a de fim
        newMarkedDates[startDate] = {
          selected: true,
          startingDay: true,
          color: 'rgb(0, 104, 116)',
          textColor: 'white',
        };
        newMarkedDates[day.dateString] = {
          selected: true,
          endingDay: true,
          color: 'rgb(0, 104, 116)',
          textColor: 'white',
        };

        setMarkedDates(newMarkedDates);
      }
    } else {
      return Alert.alert(
        'Atenção!',
        'Para prosseguir você deve selecionar o estabelecimento desejado.',
        [{ text: 'OK' }],
      );
    }
  };


  // Função para obter o intervalo de datas entre a data de início e a data de fim
  const getDateRange = (start, end) => {
    let startDate = new Date(start);
    let endDate = new Date(end);
    let range = [];

    while (startDate <= endDate) {
      range.push(startDate.toISOString().split('T')[0]);
      startDate.setDate(startDate.getDate() + 1);
    }

    return range;
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
    setEstablishimentId(null);
    setProfessionalId(null);
    setItemsEstablishment([]);
    setItemsProfessional([]);
  };

  const visibleDropdownProfissional = () => {
    if (responsibleId != null && responsibleId == dataUser.id) {
      return (
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
              setIsFocus(false);
              setStartDate(null); // Limpa a data de início selecionada
              setEndDate(null); // Limpa a data de fim selecionada
            }}
          />
        </View>
      );
    }
  };

  const renderLabelService = () => {
    if (serviceId || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'rgb(0, 104, 116)' }]}>Serviço</Text>
      );
    }
    return null;
  };

  const DropdownServices = () => {
    return (
      <View style={styles.containerDropdown}>
        {renderLabelService()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'rgb(0, 104, 116)' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={itemsService}
          search
          maxHeight={300}
          labelField="name"
          valueField="id"
          placeholder={'Selecione o serviço'}
          searchPlaceholder="Pesquisar..."
          value={serviceId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setServiceId(item.id);
            setIsFocus(false);
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    if (isFocused) {
      getEstablisiments();
    } else {
      clearDropDown();
    }
  }, [isFocused]);

  const getEstablisiments = async () => {
    const response = await api.get(`/combo/establishimentsUser/${dataUser.id}`);
    if (response.status == 200) {
      setItemsEstablishment(response.data);
    }
  };


  const getServices = async establishimentId => {
    const response = await api.get(`/services/by_establishment`, {
      params: { limit: '-1', establishment_id: establishimentId },
    });
    if (response.status == 200) {
      setItemsService(response.data.data);
    }
  };

  const getExport = async (data) => {

    setLoading(true);
    try {
      const response = await api.get(`/list/exportReport`, { params: data });
      if (response.status == 200) {
        setItemsExportReport(response.data.data);
        setTotalAmount(response.data.total_amount);
        setLoading(false);
        setNextPageUrl(response.data.next_page_url);
        setItemsCount(response.data.total)
      }

    } catch (error) {
      console.log('erro ao pegar o relatório', error)
      setLoading(false);
    }

  };


  const getNextPageData = async () => {
    if (loadingMore || !nextPageUrl) return;

    setLoadingMore(true);
    try {
      const res = await api.get(nextPageUrl, { params: dataSendExport });
      setItemsExportReport([...itemsExportReport, ...res.data.data]);
      setNextPageUrl(res.data.next_page_url);
    } catch (error) {
      console.log('erro ao consultar: ' + error)
      setLoadingMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const getProfessionalByEstablishment = async establishimentId => {
    const response = await api.get(
      `/combo/professionalByEstablishment/${establishimentId}`,
    );
    if (response.status == 200) {
      setItemsProfessional(response.data);
    }
  };

  const handleGenerateReport = async () => {
    setShowReport(true);

    const data = {
      establishment_id: establishimentId,
      professional_id: professionalId,
      service_id: serviceId,
      initial_date: startDate,
      final_date: endDate,
    }
    setDataSendExport(data)
    await getExport(data)
  };



  const downloadPDF = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    // Parâmetros que você quer passar
    const {
      establishment_id,
      professional_id,
      service_id,
      initial_date,
      final_date
    } = dataSendExport

    // Montar a URL com os parâmetros via query string
    const queryString = `?establishment_id=${establishment_id}&professional_id=${professional_id}&service_id=${service_id}&initial_date=${initial_date}&final_date=${final_date}`;

    try {
      // URL para a qual você está fazendo a requisição para o backend gerar o PDF
      const url = `http://192.168.0.26:8000/api/list/exportReportDownload${queryString}`; // Adicionar a query string

      // Caminho onde o arquivo será salvo
      const fileUri = FileSystem.documentDirectory + 'relatorio.pdf';

      // Realizar o download do PDF
      const response = await FileSystem.downloadAsync(url, fileUri, {
        headers: {
          // Adicionar os cabeçalhos necessários, como o token de autenticação
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log('Download completo:', response.uri);

        // Verificar se o dispositivo pode compartilhar o arquivo (opcional, para iOS)
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(response.uri);
        } else {
          Alert.alert('Erro', 'Compartilhamento de arquivos não disponível no seu dispositivo.');
        }
      } else {
        Alert.alert('Erro', 'Falha ao baixar o PDF');
      }
    } catch (error) {
      console.log('Erro ao baixar o relatório:', error);
      Alert.alert('Erro', 'Falha ao baixar o relatório');
    } finally {
      setLoading(false);
    }
  };




  return (
    <SafeAreaView style={styles.safeArea}>
      <Overlay isVisible={loading} />
      <Header title={'Relatório de Faturamento'} />
      <View style={styles.container}>
        {!showReport ? (
          <>
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
                  setResponsibleId(item.establishments.responsible_id);
                  getServices(item.establishment_id);
                  setEstablishimentId(item.establishment_id);
                  setIsFocus(false);
                  setStartDate(null); // Limpa a data de início
                  setEndDate(null); // Limpa a data de fim
                  if (
                    item.establishments.responsible_id != null &&
                    item.establishments.responsible_id == dataUser.id
                  ) {
                    getProfessionalByEstablishment(item.establishment_id);
                  }
                }}
              />
            </View>
            {visibleDropdownProfissional()}
            {DropdownServices()}
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={handleDatePress}
                markedDates={markedDates}
                markingType={'period'}
                firstDay={1}
                style={styles.calendar}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleGenerateReport}
                disabled={!establishimentId || !startDate || !endDate}
              >
                Gerar Relatório
              </Button>
            </View>
          </>
        ) : (
          // Aqui você pode renderizar o resultado do relatório
          <View style={styles.reportContainer}>

            <Card style={{ marginVertical: 6, elevation: 3 }}>
              <Card.Title titleStyle={{ fontWeight: 'bold', fontSize: 18 }} title={'Resumo'} />
              <Card.Content>
                <Text style={{ fontSize: 16, marginLeft: 10 }}>
                  {`Total: R$`} <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{totalAmount}</Text>
                </Text>

                <Divider style={{ margin: 10, backgroundColor: 'rgb(0, 104, 116)' }} />

                <Text style={{ fontSize: 16, marginLeft: 10, fontWeight: 'bold' }}>{`Exportar`}</Text>

                <View style={{ alignItems: 'center', marginVertical: 15 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{`PDF`}</Text>

                  <Button style={{ width: 70 }} mode="elevated" onPress={downloadPDF}>
                    <FontAwesome name="file-pdf-o" color={'red'} size={20} />
                  </Button>
                </View>
              </Card.Content>
            </Card>


            <FlatList
              data={itemsExportReport}
              showsVerticalScrollIndicator
              keyExtractor={item => item.id}
              renderItem={(item) => (<RenderItem data={item} />)}
              contentContainerStyle={{ padding: 5 }}
              onEndReached={getNextPageData}
              onEndReachedThreshold={0}
              ListEmptyComponent={<EmptyListMessage count={itemsCount} message="Nenhum resultado encontrado." />}

            />


            <View style={styles.backButtonContainer}>
              <Button mode="contained" onPress={() => setShowReport(false)}>
                Voltar
              </Button>
            </View>
          </View>
        )}
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
    borderRadius: 15,
    marginBottom: 10,
  },
  calendarContainer: {
    marginTop: 30,
    borderWidth: 2,
    borderColor: 'rgb(0, 104, 116)',
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  containerDropdown: {
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
    top: 15,
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
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  reportContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  reportText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  backButtonContainer: {
    marginTop: 20,
  },
});

export default AppointmentsScreen;
