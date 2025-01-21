import React, { useContext, useState } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, endOfMonth, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from '../../components/Header';
import api from '../../services';
import { AuthContext } from '../../contexts/auth'
import RenderItem from './components/RenderItem';

export function SchedulingHistory({ route }) {
    const [startDate, setStartDate] = useState(startOfMonth(new Date()));
    const [endDate, setEndDate] = useState(endOfMonth(new Date()));
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);

    
    const { establishment_id, establishment_name } = route.params;

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/list/hystoric-user`, {
                params: {
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                    establishment_id: establishment_id,
                    user_id: user.user.id,
                }
            });
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date) => {
        return format(date, "dd/MM/yyyy", { locale: ptBR });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header title="Histórico de Agendamentos" subtitle={establishment_name} />

            <View style={{ flex: 1, padding: 16 }}>
                <View style={{ gap: 16, marginBottom: 16 }}>
                    <TextInput
                        label="Data Início"
                        value={formatDate(startDate)}
                        onPressIn={() => setShowStartPicker(true)}
                        right={<TextInput.Icon icon="calendar" />}
                    />

                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            locale="pt-BR"
                            onChange={(event, date) => {
                                setShowStartPicker(false);
                                if (date) setStartDate(date);
                            }}
                        />
                    )}

                    <TextInput
                        label="Data Fim"
                        value={formatDate(endDate)}
                        onPressIn={() => setShowEndPicker(true)}
                        right={<TextInput.Icon icon="calendar" />}
                    />

                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            locale="pt-BR"
                            onChange={(event, date) => {
                                setShowEndPicker(false);
                                if (date) setEndDate(date);
                            }}
                        />
                    )}

                    <Button
                        mode="contained"
                        onPress={handleSearch}
                        loading={isLoading}
                    >
                        Buscar
                    </Button>
                </View>

                <View style={{ flex: 1 }}>
                    <FlatList
                        data={schedules}
                        renderItem={(item) => <RenderItem data={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ padding: 8 }}
                    />
                    
                    {schedules.length === 0 && !isLoading && (
                        <Text style={{ textAlign: 'center', marginTop: 16 }}>
                            Nenhum agendamento encontrado
                        </Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
} 