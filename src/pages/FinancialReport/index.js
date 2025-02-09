import React, { useState, useEffect, useContext, useCallback } from 'react';
import { SafeAreaView, View, StyleSheet, Alert, FlatList, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Header from '../../components/Header';
import Overlay from '../../components/Ui/Overlay';
import api from '../../services';


import { Text, Button, Card, Icon, Divider } from 'react-native-paper'; // Importação do Button
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import EmptyListMessage from '../../components/Ui/EmptyListMessage';
import RenderItem from './components/RenderItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import moment from 'moment';
import LocaleConfigPt from '../../util/calendar/LocaleConfigPt';
import Dropdown from '../../components/Ui/Input/Dropdown';
import { BannerAdComponent } from '../../components/AdsMob/components/BannerAdComponent';
import { getEstablishmentStorage } from '../../helpers';
import { usePayment } from '../../contexts/PaymentContext';
LocaleConfigPt


const AppointmentsScreen = () => {
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
  const [hiddeArrowBack, setHiddeArrowBack] = useState(true);
  const { RewardedAd } = usePayment();




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

  const clearDropDown = () => {
    setEstablishimentId(null);
    setProfessionalId(null);
    setServiceId(null);
    setItemsEstablishment([]);
    setItemsProfessional([]);
    setItemsService([]);
  };

  const visibleDropdownProfissional = () => {
    if (responsibleId != null && responsibleId == dataUser.id) {
      return (
        <Dropdown
          label="Profissional"
          data={itemsProfessional}
          placeholder="Selecione o profissional"
          value={professionalId}
          onChange={(item) => {
            if (item) {
              setProfessionalId(item.user_id);
              setStartDate(null);
              setEndDate(null);
            } else {
              setProfessionalId(null);
            }
          }}
          labelField="user.name"
          valueField="user.id"
        />
      );
    }
  };


  const DropdownServices = () => {
    return (

      <Dropdown
        label="Serviço"
        data={itemsService}
        placeholder="Selecione o serviço"
        value={serviceId}
        onChange={(item) => {
          if (item) {
            setServiceId(item.id);
          } else {
            setServiceId(null);
          }
        }}
        labelField="name"
        valueField="id"
      />

    );
  };

  const setEstablishmentId = async () => {
    const establishment = await getEstablishmentStorage();
    if (establishment?.id) {
      const establishmentItem = itemsEstablishment.find(
        item => item.establishment_id === establishment.id
      );
      
      if (establishmentItem) {
        // Simula o onChange do dropdown
        if (establishmentItem.establishments?.responsible_id === dataUser.id) {
          getProfessionalByEstablishment(establishment.id);
          getServices(establishment.id);
          setEstablishimentId(establishment.id);
          setResponsibleId(establishmentItem.establishments.responsible_id);
          setStartDate(null);
          setEndDate(null);
        }
      }
    }
  };

  useEffect(() => {
    if (itemsEstablishment.length > 0) {
      setEstablishmentId();
    }
  }, [itemsEstablishment]);

  useEffect(() => {
    if (isFocused) {
      getEstablisiments();
      setEstablishmentId()
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
    await RewardedAd();
    setShowReport(true);
    setHiddeArrowBack(false);

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

  const goBackFilterReport = async () => {
    setShowReport(false)
    setHiddeArrowBack(true);

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
    } = dataSendExport;

    // Criação da query string apenas com os parâmetros que não são nulos ou indefinidos
    const queryParams = [];

    if (establishment_id) queryParams.push(`establishment_id=${encodeURIComponent(establishment_id)}`);
    if (professional_id) queryParams.push(`professional_id=${encodeURIComponent(professional_id)}`);
    if (service_id) queryParams.push(`service_id=${encodeURIComponent(service_id)}`);
    if (initial_date) queryParams.push(`initial_date=${encodeURIComponent(initial_date)}`);
    if (final_date) queryParams.push(`final_date=${encodeURIComponent(final_date)}`);

    // Juntar todos os parâmetros que foram adicionados
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    try {
      // URL para a qual você está fazendo a requisição para o backend gerar o PDF
      const url = `${process.env.EXPO_PUBLIC_API_URL}/list/exportReportDownload${queryString}`;

      // Caminho onde o arquivo será salvo
      const fileUri = FileSystem.documentDirectory + `relatorio-financeiro-${moment().format('DD-MM-YYYY')}.pdf`; // Definir caminho do arquivo

      // Realizar o download do PDF
      const response = await FileSystem.downloadAsync(url, fileUri, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        if (Platform.OS === 'android') {
          // Para Android, use IntentLauncher para abrir o arquivo com o aplicativo padrão de PDF
          FileSystem.getContentUriAsync(response.uri).then(uri => {
            IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
              data: uri,
              flags: 1,
            });
          });
        } else if (Platform.OS === 'ios') {
          // Para iOS, compartilhe o arquivo ou abra-o diretamente
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(response.uri);
          } else {
            Alert.alert('Erro', 'Abertura de arquivos não disponível no seu dispositivo.');
          }
        }
      } else {
        Alert.alert('Erro', 'Falha ao baixar o PDF');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao baixar o relatório');
    } finally {
      setLoading(false);
    }
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <Overlay isVisible={loading} />
      <Header title={'Relatório de Faturamento'} showBack={hiddeArrowBack} />
      <View style={styles.container}>
        {!showReport ? (
          <>
            <Card style={{ padding: 15 }}>
                <Dropdown
                  disable={true}
                  label="Estabelecimento"
                  data={itemsEstablishment}
                  placeholder="Selecione o estabelecimento"
                  value={establishimentId}
                  onChange={(item) => {
                    if (item != null) {
                      if (
                        item.establishments?.responsible_id != null &&
                        item.establishments?.responsible_id == dataUser.id
                      ) {
                        getProfessionalByEstablishment(item.establishment_id);
                        getServices(item.establishment_id);
                        setEstablishimentId(item.establishment_id);
                        setResponsibleId(item.establishments.responsible_id);
                        setStartDate(null);
                        setEndDate(null);
                      }
                    } else {
                      setEstablishimentId(null);
                    }
                  }}
                  labelField="establishments.name"
                  valueField="establishments.id"
                />

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
            </Card>
            <BannerAdComponent />
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

                  <Button style={{ width: 70 }} mode="elevated" onPress={downloadPDF} disabled={totalAmount == "0,00"}>
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
              <Button mode="contained" onPress={goBackFilterReport}>
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
    padding: 10,
    justifyContent: 'center'
  },
  calendar: {
    borderRadius: 15,
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
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  reportContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  backButtonContainer: {
    marginTop: 20,
  },
});

export default AppointmentsScreen;
