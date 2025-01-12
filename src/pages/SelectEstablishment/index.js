import React, { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/auth';
import api from '../../services';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dropdown from '../../components/Ui/Input/Dropdown';

export function SelectEstablishment() {
    const [establishments, setEstablishments] = useState([]);
    const [selectedEstablishment, setSelectedEstablishment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [establishmentName, setEstablishmentName] = useState(null);
    const { user } = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        loadEstablishments();
    }, []);

    async function loadEstablishments() {
        if (!isLoading) return;

        try {
            const response = await api.get(`/combo/establishimentsUser/${user.user?.id}`)
            if (response.status == 200) {
                setEstablishments(response.data);
            }
        } catch (error) {
            console.error('Error loading establishments:', error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleSelectEstablishment() {
        if (selectedEstablishment) {
            // Store selected establishment in AsyncStorage or Context
            AsyncStorage.removeItem('establishmentIdLogged')
            AsyncStorage.setItem('establishmentIdLogged', JSON.stringify({ id: selectedEstablishment, name: establishmentName }))
                .then(() => {
                    navigation.navigate('TabRoutes');
                });
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text variant="headlineMedium" style={styles.title}>
                    Selecione um estabelecimento
                </Text>

                <Text variant="bodyLarge" style={styles.subtitle}>
                    Escolha o estabelecimento que você deseja gerenciar
                </Text>

                <Dropdown
                    label="Estabelecimento"
                    data={establishments}
                    placeholder="Selecione o estabelecimento"
                    value={selectedEstablishment}
                    onChange={(item) => {
                        if (item) {
                            setSelectedEstablishment(item.establishments?.id);
                            setEstablishmentName(item.establishments?.name);
                        } else {
                            setSelectedEstablishment(null);
                        }
                    }}
                    labelField="establishments.name"
                    valueField="establishments.id"
                />

                <Button
                    mode="contained"
                    onPress={handleSelectEstablishment}
                    disabled={!selectedEstablishment}
                    style={styles.button}
                >
                    Continuar
                </Button>
            </View>
        </SafeAreaView>
    );
} 