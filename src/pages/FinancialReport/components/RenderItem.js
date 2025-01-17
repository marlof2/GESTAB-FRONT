import React from 'react';
import { Card, Avatar, Chip, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { helper } from '../../../helpers/inputs';
import moment from 'moment';

export default function RenderItem({ data }) {
    const item = data.item;

    return (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.row}>
                    <Text style={styles.label}>Data:</Text>
                    <Text style={styles.value}>{moment(item.date).format('DD/MM/YYYY')}</Text>
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
                    <Text style={styles.value}>
                        {helper.formatMoney(item.service.amount)}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Situação:</Text>
                    <Chip
                        style={[
                            styles.chip,
                            { backgroundColor: '#4CAF50' },
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
        // Removemos o flex: 1
        fontSize: 16,
        color: '#555',
        marginRight: 8, // Adicionamos um pequeno espaçamento à direita
    },
    value: {
        // Removemos o flex: 2
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
