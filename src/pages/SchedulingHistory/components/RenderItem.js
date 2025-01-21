import React from 'react';
import { Card, Chip, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function RenderItem({ data }) {
    const item = data.item;
    
    // Format date to Brazilian format (dd/MM/yyyy)
    const formattedDate = format(new Date(item.date), 'dd/MM/yyyy', { locale: ptBR });
    
    // Format time (removing seconds)
    const formattedTime = item.time.substring(0, 5);
    
    // Format amount to Brazilian currency
    const formattedAmount = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(item.service.amount);

    return (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.row}>
                    <Text style={styles.label}>Data:</Text>
                    <Text style={styles.value}>{formattedDate}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Horário:</Text>
                    <Text style={styles.value}>{formattedTime}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Serviço:</Text>
                    <Text style={styles.value}>{item.service.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Profissional:</Text>
                    <Text style={styles.value}>{item.professional.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Valor:</Text>
                    <Text style={styles.value}>{formattedAmount}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Situação:</Text>
                    <Chip
                        style={[
                            styles.chip,
                            { backgroundColor: item.status.id === 3 ? '#4CAF50' : '#FF9800' }
                        ]}
                        textStyle={styles.chipText}
                    >
                        {item.status.name}
                    </Chip>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 6,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        marginVertical: 4,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginRight: 8,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    chip: {
        paddingHorizontal: 0,
        height: 30,
        justifyContent: 'center',
    },
    chipText: {
        color: '#fff',
        fontWeight: 'bold',
    },
}); 