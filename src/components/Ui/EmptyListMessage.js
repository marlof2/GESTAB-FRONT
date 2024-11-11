import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyListMessage = ({ message, count }) => {
    if (count == 0)
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{message}</Text>
            </View>
        );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#555',
    },
});

export default EmptyListMessage;