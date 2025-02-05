import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, FlatList, SafeAreaView } from 'react-native';
import { ActivityIndicator, Chip, FAB, Modal, Portal, Searchbar, Text } from 'react-native-paper';
import styles from './styles';
import Header from '../../components/Header';
import api from "../../services";
import RenderItem from './componets/renderItem'
import theme from '../../themes/theme.json'
import Form from './componets/form';
import Snackbar from '../../components/Ui/Snackbar';
import { useSelector, useDispatch } from 'react-redux';
import { infoModal, reloadItemsCard } from './reducer';
import EmptyListMessage from '../../components/Ui/EmptyListMessage';
import ModalDelete from './componets/modalDelete'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Index({ route }) {
  const dispatch = useDispatch();
  const { establishmentId, establishmentName } = route.params;

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [itemsCount, setItemsCount] = useState(null);
  const visibleForm = useSelector((state) => state.service.modal.visible);
  const reloadListCard = useSelector((state) => state.service.reloadCards);


  useEffect(() => {
    getAll()

    return () => { }

  }, [])


  const getAll = async () => {
    if (loading) return;

    setLoading(true);
    const response = await api.get(`/services/by_establishment`, { params: search ? { search: search, establishment_id: establishmentId } : { establishment_id: establishmentId } })

    if (response.status == 200) {
      setItems(response.data.data);
      setNextPageUrl(response.data.next_page_url);
      setItemsCount(response.data.total)
      setRefreshing(false);
    }
    setLoading(false);
  }


  const getNextPageData = async () => {
    if (loadingMore || !nextPageUrl) return;

    setLoadingMore(true);
    try {
      const res = await api.get(nextPageUrl, { params: search ? { search: search } : null });
      setItems([...items, ...res.data.data]);
      setNextPageUrl(res.data.next_page_url);
    } catch (error) {
      console.log('erro ao consultar: ' + error)
    } finally {
      setLoadingMore(false);
    }
  };


  const handleRefresh = () => {
    setRefreshing(true);
    setItems([]);
    setNextPageUrl(null)
    getAll()
    setRefreshing(false);
  };


  const renderFooter = () => {
    if (loading || loadingMore) {
      return <ActivityIndicator animating={true} size='small' />;
    }
  };

  if (reloadListCard) {
    dispatch(reloadItemsCard(false));
    handleRefresh()
  }


  const openModal = () => {
    dispatch(infoModal({ action: 'create', visible: true }));

  }


  return (
    <SafeAreaView style={styles.safeArea}>

      <Header title={'Serviços'}  subtitle={establishmentName}/>
      <Searchbar
        style={{ margin: 10, borderRadius: 15 }}
        placeholder="Busca por nome"
        onChangeText={setSearch}
        value={search}
        onSubmitEditing={handleRefresh}
        elevation={1}
        icon='filter-outline'
        right={() =>  (<Icon name="magnify" style={{ paddingRight: 15 }} onPress={handleRefresh} size={26} />)}
      />

      <View style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : ''}
          enabled
        >

          <FlatList
            data={items}
            showsVerticalScrollIndicator
            keyExtractor={item => item.id}
            renderItem={(item) => (<RenderItem data={item} />)}
            contentContainerStyle={{ padding: 5, }}
            onEndReached={getNextPageData}
            onEndReachedThreshold={0}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={<EmptyListMessage count={itemsCount} message="Nenhum resultado encontrado." />}

          />
        </KeyboardAvoidingView>
      </View>

      <FAB
        color={theme.colors.white}
        label='Adicionar'
        icon="plus"
        style={styles.fab}
        onPress={openModal}
      />

      <Portal>
        <Modal visible={visibleForm} dismissable={!visibleForm} contentContainerStyle={{ borderRadius: 15, margin: 3 }}>
          <Form establishmentId={establishmentId} />
        </Modal>
      </Portal>

      <ModalDelete />

      <Snackbar />

    </SafeAreaView>
  )
}
