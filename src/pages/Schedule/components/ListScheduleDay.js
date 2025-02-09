import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, FlatList, SafeAreaView } from 'react-native';
import { ActivityIndicator, FAB, Modal, Portal, Searchbar, Menu, Divider } from 'react-native-paper';
import styles from '../styles'
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Form from './Form';
import { helper } from '../../../helpers/inputs';

export default function Index({ route }) {
    const { date, establishment_id, professional_id, professional_name, typeSchedule, block_calendar_id } = route.params;
    const dataParams = {
        date, establishment_id, professional_id
    }
    const dispatch = useDispatch();
    const isFocused = useIsFocused()

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [itemsCount, setItemsCount] = useState(null);
    const reloadListCard = useSelector((state) => state.schedule.reloadCards);
    const visibleForm = useSelector((state) => state.schedule.modal.visible);


    useEffect(() => {
        if (isFocused) {
            getAll()
        }

        return () => { }

    }, [isFocused])

    const getAll = async (status = 'waiting') => {
        if (loading) return;
        handleRefreshWithOutGetAll()

        setLoading(true);

        const queryParams = {
            ...dataParams,
            typeSchedule,
            clientsAttended: status,
            ...(search && { search })
        };

        const response = await api.get('/list', { params: queryParams });

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
            const res = await api.get(nextPageUrl, { params: search ? { search: search, ...dataParams, typeSchedule } : { ...dataParams, typeSchedule } });
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


    const openModal = () => {
        dispatch(infoModal(
            {
                action: 'create',
                visible: true,
                data:
                {
                    establishment_id,
                    date,
                    professional_id,
                    typeSchedule,
                    block_calendar_id
                }
            }));
    }

    const title = () => {
        return `📆 ${moment(date).format('DD/MM/YYYY')}`
    }

    const subtitle = () => {
        return `👤 Profissional: ${professional_name}`
    }

    const description = () => {
        return `📒 Tipo de agenda: ${helper.formatTypeSchedule(typeSchedule)}`
    }


    return (
        <SafeAreaView style={styles.safeArea}>
            <Header
                title={title()}
                subtitle={subtitle()}
                description={description()}
                showMenu={true}
            >
                <Menu.Item
                    dense
                    leadingIcon="account-group"
                    title="Clientes Atendidos"
                    style={styles.menuItem}
                    titleStyle={styles.menuItemText}
                    rippleColor="rgba(0, 0, 0, .08)"
                    onPress={() => {
                        getAll('attended')
                    }}
                />
                <Divider />
                <Menu.Item
                    dense
                    leadingIcon="account-clock"
                    title="Clientes em Espera"
                    style={styles.menuItem}
                    titleStyle={styles.menuItemText}
                    rippleColor="rgba(0, 0, 0, .08)"
                    onPress={() => {
                        getAll()
                    }}
                    
                />
            </Header>

            <Searchbar
                style={{ margin: 10, borderRadius: 15 }}
                placeholder="Nome do cliente"
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
                label='Agendar'
                icon="calendar-account"
                style={styles.fab}
                onPress={openModal}
            />


            <Portal>
                <Modal visible={visibleForm} dismissable={!visibleForm} contentContainerStyle={{ borderRadius: 15, margin: 3 }}>
                    <Form />
                </Modal>
            </Portal>


            <ModalDelete />

            <Snackbar />

        </SafeAreaView>
    )
}

