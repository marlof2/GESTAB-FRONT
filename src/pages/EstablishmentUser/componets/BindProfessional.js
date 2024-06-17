import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { ActivityIndicator, Button, Chip, FAB, Modal, Portal, Searchbar } from 'react-native-paper';
import Header from '../../../components/Header';
import api from "../../../services";
import RenderItemForm from './RenderItemForm'
import theme from '../../../themes/theme.json'
import Snackbar from '../../../components/Ui/Snackbar';
import { useSelector, useDispatch } from 'react-redux';
import { resetArrayProfessional } from '../reducer';
import EmptyListMessage from '../../../components/Ui/EmptyListMessage';
// import { useIsFocused } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native';
import { setSnackbar } from '../../../store/globalSlice';
import Overlay from '../../../components/Ui/Overlay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Index({ route }) {
  const { establishmentId, establishmentName } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // const isFocused = useIsFocused()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false);
  const [loadingBindProfessional, setLoadingBindProfessional] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [itemsCount, setItemsCount] = useState(null);
  const professionalsToBind = useSelector((state) => state.establishmentUser.professionals);


  useEffect(() => {
    getAll()

    return () => { }

  }, [])

  const getAll = async () => {
    if (loading) return;

    setLoading(true);
    const response = await api.get(`/users/listProfessionalsToEstablishmentUser`, { params: search ? { search: search, profile_id: 3,  establishment_id: establishmentId } : { profile_id: 3, establishment_id: establishmentId } })

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
      const res = await api.get(nextPageUrl, { params: search ? { search: search } : { profile_id: 3 } });
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


  async function addProfessionals() {
    setLoadingBindProfessional(true);
    try {
      const data = {
        user_id: professionalsToBind,
        establishment_id: establishmentId
      }
      const { status } = await api.post('/establishment_user', data);

      if (status == 201) {
        handleRefresh()
        dispatch(setSnackbar({ visible: true, title: 'Vinculado com sucesso!' }));
        dispatch(resetArrayProfessional());

        setLoadingBindProfessional(false);
      }

    } catch (error) {
      console.log('erro ao vincular profissional', error)
      setLoadingBindProfessional(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Overlay isVisible={loadingBindProfessional} />
      <Header title={'Vincular Profissional '} subtitle={establishmentName} />

      <Searchbar
        style={{ margin: 10, borderRadius: 15 }}
        placeholder="Nome e CPF"
        onChangeText={(text) => setSearch(text)}
        value={search}
        onSubmitEditing={handleRefresh}
        elevation={1}
        icon='filter-outline'
        right={() =>  (<Icon name="magnify" style={{ paddingRight: 15 }} onPress={handleRefresh} size={26} />)}
      />


      <View style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : ''}
          enabled>

          <FlatList
            data={items}
            showsVerticalScrollIndicator
            keyExtractor={item => item.id}
            renderItem={(item) => (<RenderItemForm data={item} />)}
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
        label='Salvar Profissionais'
        icon="content-save-outline"
        style={styles.fab}
        onPress={addProfessionals}
      />

      <Snackbar />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: { flex: 1 },
  safeArea: { flex: 1 },
  card: {
    margin: 8,
    backgroundColor: '#ffffff',
  },
  fab: {
    position: 'absolute',
    margin: 10,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary
  },

})

