import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, FlatList, SafeAreaView } from 'react-native';
import { ActivityIndicator, Divider, FAB, Modal, Portal, Searchbar, Text, Chip } from 'react-native-paper';
import styles  from '../styles'
import Header from '../../../components/Header';
import api from "../../../services";
import RenderItem from '../components/RenderItem'
import theme from '../../../themes/theme.json'
import Snackbar from '../../../components/Ui/Snackbar';
import { useSelector, useDispatch } from 'react-redux';
import { infoModal, reloadItemsCard } from '../reducer';
import EmptyListMessage from '../../../components/Ui/EmptyListMessage';
import ModalDelete from '../components/ModalDelete'
import { useIsFocused } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native';
// import Chip from '../../components/Ui/Chip';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Index({ route }) {
    const { date } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused()

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [itemsCount, setItemsCount] = useState(null);
    const reloadListCard = useSelector((state) => state.schedule.reloadCards);


    useEffect(() => {
        if (isFocused) {
            getAll()
        }

        return () => { }

    }, [isFocused])

    const getAll = async () => {
        if (loading) return;
        handleRefreshWithOutGetAll()

        setLoading(true);
        const response = await api.get(`/list`, { params: search ? { search: search } : null })

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

    const handleRefreshWithOutGetAll = () => {
        setItems([]);
        setNextPageUrl(null)
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




    return (
        <SafeAreaView style={styles.safeArea}>

            <Header title={'Profissionais Vinculados '}  />

            <Searchbar
                style={{ margin: 10, borderRadius: 15 }}
                placeholder="Nome e CPF"
                onChangeText={setSearch}
                value={search}
                onSubmitEditing={handleRefresh}
                elevation={1}
                icon='filter-outline'
                right={() => (<Icon name="magnify" style={{ paddingRight: 15 }} onPress={handleRefresh} size={26} />)}
            />


            <View style={styles.background}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : ''}
                    enabled>


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
                label='Vincular'
                icon="link-variant-plus"
                style={styles.fab}
                onPress={() => {}}
            />

            <ModalDelete />

            <Snackbar />

        </SafeAreaView>
    )
}
