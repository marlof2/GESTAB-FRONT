import React, { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/auth';
import api from '../../services';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dropdown from '../../components/Ui/Input/Dropdown';
import { useIsFocused } from '@react-navigation/native';
import Overlay from '../../components/Ui/Overlay';


export function SelectEstablishment() {
    const [establishments, setEstablishments] = useState([]);
    const [selectedEstablishment, setSelectedEstablishment] = useState(null);
    const [establishmentName, setEstablishmentName] = useState(null);
    const { user } = useContext(AuthContext);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);



    useEffect(() => {
        if (isFocused) {
            loadEstablishments();
        }
    }, [isFocused]);



    async function loadEstablishments() {
        setIsLoading(true);
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
            // AsyncStorage.removeItem('establishmentIdLogged')
            AsyncStorage.setItem('establishmentIdLogged', JSON.stringify({ id: selectedEstablishment, name: establishmentName }))
                .then(() => {
                    navigation.navigate('TabRoutes');
                });
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {isLoading ? (
                <Overlay isVisible={isLoading} />
            ) : (
                <View style={styles.content}>
                    {establishments.length === 0 ? (

                        <>
                            <Text variant="headlineMedium" style={styles.title}>
                                Olá, {user.user?.name}!
                            </Text>

                            <Text variant="bodyLarge" style={[styles.subtitle, styles.explanationText]}>
                                Esta informação é mostrada quando você não tem nenhum estabelecimento associado,
                                o primeiro passo é associar um estabelecimento à sua conta.
                            </Text>
                            <Text variant="bodyLarge" style={[styles.subtitle, styles.explanationText]}>
                            Para começar, você precisa associar um estabelecimento à sua conta. Você pode fazer isso de duas formas:
                            </Text>


                            <Text variant="bodyMedium" style={styles.instructionText}>
                                1. Pela Home: Acesse a opção "Meus estabelecimentos"
                            </Text>

                            <Text variant="bodyMedium" style={styles.instructionText}>
                                2. Pelo Menu: Acesse a opção "Meus estabelecimentos"
                            </Text>

                            <Button
                                mode="contained"
                                onPress={() => navigation.navigate('TabRoutes')}
                                style={[styles.button, { marginTop: 16 }]}
                            >
                                Ir para Home

                            </Button>
                        </>
                    ) : (
                        <>
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

                        </>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
} 