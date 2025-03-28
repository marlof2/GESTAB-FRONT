import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { ActivityIndicator, Surface, Text, Button, Searchbar, TextInput } from 'react-native-paper';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../../services';
import EmptyListMessage from '../../components/Ui/EmptyListMessage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../../components/Header';
import Snackbar from '../../components/Ui/Snackbar';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../../store/globalSlice';
import ModalDelete from './components/modalDelete';
import { useIsFocused } from '@react-navigation/native';
import { getEstablishmentStorage } from '../../helpers';
import { AuthContext } from '../../contexts/auth';
import { helper } from '../../helpers/inputs';

function BlockItem({ item, onDelete }) {
  const formatTime = (timeString) => {
    if (!timeString) return '00:00';
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  const getPeriodLabel = (period) => {
    const periodTranslation = {
      allday: 'Dia Todo',
      morning: 'Manhã',
      afternoon: 'Tarde',
      night: 'Noite'
    };

    const formattedStartTime = formatTime(item.time_start);
    const formattedEndTime = formatTime(item.time_end);
    const timeRange = `${formattedStartTime} - ${formattedEndTime}`;

    return `${periodTranslation[period] || period} (${timeRange})`;
  };

  return (
    <Surface style={styles.itemContainer} elevation={2}>
      <View style={styles.itemContent}>
        <View>
          <Text style={styles.dateText}>
            {format(new Date(item.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </Text>
          <Text style={styles.periodText}>
            Período: {getPeriodLabel(item.period)}
          </Text>
        </View>
        <Button
          icon="delete"
          mode="text"
          textColor="red"
          onPress={() => onDelete(item.id)}
          style={styles.deleteButton}
        />
      </View>
    </Surface>
  );
}

export default function ListBlockCalendar() {
  const { user } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [itemsCount, setItemsCount] = useState(0);
  
  // Inicializa as datas com primeiro e último dia do mês atual
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [establishment, setEstablishment] = useState(null);

  // Adicione o estado do modal
  const [modalDelete, setModalDelete] = useState({ visible: false, id: null });

  const handleStartDateChange = (event, date) => {
    setShowStartPicker(false);
    if (date) {
      const newStartDate = startOfMonth(date);
      const newEndDate = endOfMonth(date);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  };

  const handleEndDateChange = (event, date) => {
    setShowEndPicker(false);
    if (date) {
      setEndDate(date);
    }
  };

  const loadBlocks = async (pageUrl = null, establishmentId = null) => {
    if (loading) return;

    setLoading(true);
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const url = pageUrl || '/blockcalendars';
      const response = await api.get(url, {
        params: { 
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          establishment_id: establishmentId || establishment?.id,
          user_id: user.user?.id
        }
      });

      if (response.status === 200) {
        const { data, next_page_url, total } = response.data;
        setBlocks(pageUrl ? [...blocks, ...data] : data);
        setNextPageUrl(next_page_url);
        setItemsCount(total);
      }
    } catch (error) {
      console.error('Erro ao carregar bloqueios:', error);
      dispatch(setSnackbar({ visible: true, title: 'Erro ao carregar bloqueios!' }));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    async function initializeData() {
      if (isFocused) {
        try {
          const establishmentData = await getEstablishmentStorage();
          setEstablishment(establishmentData);
          await loadBlocks(null, establishmentData.id);
        } catch (error) {
          console.error('Erro ao inicializar dados:', error);
          dispatch(setSnackbar({ visible: true, title: 'Erro ao inicializar dados!' }));
        }
      }
    }

    initializeData();

    return () => {
      setBlocks([]);
      setNextPageUrl(null);
    }
  }, [isFocused]);

  const handleLoadMore = () => {
    if (nextPageUrl) {
      loadBlocks(nextPageUrl);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setBlocks([]);
    setNextPageUrl(null);
    loadBlocks();
  };

  const handleSearch = () => {
    setBlocks([]);
    setNextPageUrl(null);
    loadBlocks();
  };

  const handleDelete = async (blockId) => {
    setModalDelete({ visible: true, id: blockId });
  };

  const onConfirmDelete = async () => {
    try {
      const response = await api.delete(`/blockcalendars/${modalDelete.id}`);
      if (response.status === 200) {
        dispatch(setSnackbar({ visible: true, title: 'Bloqueio deletado com sucesso!' }));
        loadBlocks();
      }
    } catch (error) {
      console.error('Erro ao deletar bloqueio:', error);
      dispatch(setSnackbar({ visible: true, title: 'Erro ao deletar bloqueio!' }));
    } finally {
      setModalDelete({ visible: false, id: null });
    }
  };

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator style={styles.loader} />;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Bloqueios cadastrados" subtitle={`Estabelecimento: ${establishment?.name}`} />
      <View style={styles.filterContainer}>
        <View style={styles.dateInputsRow}>
          <TextInput
            label="Data Início"
            value={format(startDate, "dd/MM/yyyy")}
            onPressIn={() => setShowStartPicker(true)}
            right={<TextInput.Icon icon="calendar" />}
            mode="outlined"
            dense
            outlineStyle={{ borderRadius: 10 }}
            style={[styles.dateInput, { flex: 1, marginRight: 8 }]}
          />

          <TextInput
            label="Data Fim"
            value={format(endDate, "dd/MM/yyyy")}
            onPressIn={() => setShowEndPicker(true)}
            right={<TextInput.Icon icon="calendar" />}
            mode="outlined"
            dense
            outlineStyle={{ borderRadius: 10 }}
            style={[styles.dateInput, { flex: 1 }]}
          />
        </View>

        <Button 
          mode="contained"
          icon="magnify"
          onPress={handleSearch}
          style={styles.searchButton}
        >
          Buscar
        </Button>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            locale="pt-BR"
            onChange={handleStartDateChange}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            locale="pt-BR"
            onChange={handleEndDateChange}
          />
        )}
      </View>

      <FlatList
        data={blocks}
        renderItem={({ item }) => <BlockItem item={item} onDelete={handleDelete} />}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyListMessage 
            count={itemsCount} 
            message="Nenhum bloqueio encontrado para esta data." 
          />
        }
        contentContainerStyle={styles.listContainer}
      />
      <Snackbar />
      
      {/* Adicione o Modal de confirmação */}
      <ModalDelete 
        visible={modalDelete.visible}
        onDismiss={() => setModalDelete({ visible: false, id: null })}
        onConfirm={onConfirmDelete}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir este bloqueio?"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterContainer: {
    padding: 16,
  },
  dateInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInput: {
    backgroundColor: '#fff',
  },
  searchButton: {
    borderRadius: 10,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  itemContainer: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  periodText: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    marginLeft: 8,
  },
  loader: {
    marginVertical: 16,
  },
}); 