import React, { useContext, useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { ActivityIndicator, Button, FAB, Modal, Portal, Searchbar, Text } from 'react-native-paper';
import styles from './styles';
import Overlay from '../../components/Ui/Overlay';
import Header from '../../components/Header';
import { useIsFocused } from '@react-navigation/native'
import api from "../../services";
import RenderItem from './componets/RenderItem';
import theme from '../../themes/theme.json'
import Form from './form';
import Snackbar from '../../components/Ui/Snackbar';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { infoModal, reloadItemsCard } from './reducer/slice';

export default function Index() {
  const dispatch = useDispatch();

  const isFocused = useIsFocused()
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // const [reloadList, setReloadList] = useState(false);
  const [search, setSearch] = useState('');

  const visibleForm = useSelector((state) => state.establishment.modal.visible);
  const reloadListCard = useSelector((state) => state.establishment.reloadCards);


  useEffect(() => {
    if (isFocused) {
      getAll()
    }

    return () => { }

  }, [isFocused, page])


  const getAll = async () => {

    if (loading) return;

    setLoading(true);
    const response = await api.get('/establishments', { params: { page, search: search } })

    if (response.status == 200) {
      setItems((prevItems) => page === 1 ? response.data.data : [...prevItems, ...response.data.data]);
      setHasMore(response.data.data.length > 0);
      setRefreshing(false);
    }
    setLoading(false);
  }

  //VERIFICA SE TEM MAIS ITENS PARA BUSCAR NO BACK O O RESTANTE DA PAGINA
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setItems([]);
    setHasMore(true);
    setRefreshing(false);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator animating={true} size='small' />;

  };

  //RECARREGA A LISTA COM OS CARDS (ESSA AÇÃO VEM DO COMPONENTE FILHO RenderItem)
  // const reloadLisrCards = () => {
  //   if (reloadListCard) {
  //     handleRefresh()
  //   }
  // };

  if (reloadListCard) {
    console.log(reloadListCard)
    setTimeout(() => {
      handleRefresh()
      dispatch(reloadItemsCard(false));
    }, 1000);
  }


  // MODAL FORM ESSA AÇÃO VEM DO COMPOENETE PAI
  const openModal = () => {
    dispatch(infoModal({ visible: true }));
  }


  return (
    <View style={{ flex: 1 }}>
      <Overlay isVisible={false} />
      <Header title={'Estabelecimentos'} />

      <Searchbar
        style={{ margin: 10, borderRadius: 15 }}
        placeholder="Nome, CPF, CNPJ e telefone"
        onChangeText={setSearch}
        value={search}
        onSubmitEditing={handleRefresh}
        onClearIconPress={handleRefresh}
      />

      <View style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : ''}
          enabled
          style={styles.container}>

          <FlatList
            data={items}
            showsVerticalScrollIndicator
            keyExtractor={item => item.id}
            renderItem={(item) => (<RenderItem data={item} />)}
            contentContainerStyle={{ padding: 5, }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={1}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListFooterComponent={renderFooter}
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

          <Form />
        </Modal>
      </Portal>

      <Snackbar />

    </View>
  )
}
