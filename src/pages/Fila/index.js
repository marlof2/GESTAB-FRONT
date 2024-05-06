import React, { useState } from 'react';
import Header from '../../components/Header';
import { ScrollView, View } from 'react-native';
import { Avatar, Button, Card, Text, TextInput, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather'


const Fila = () => {
    const [text, setText] = useState("");

    return (

        <View backgroundColor="#f0f4ff" style={{ flex: 1 }}>

            <ScrollView>
                <Header title="Fila de espera" />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, margin: 10 }}>
                    <Chip style={{ width: '100%', backgroundColor: 'white' }}>Profissional: Tiquinho  | Data: 01/02/2024</Chip>
                </View>

                <Card style={{ padding: 20, margin: 10, backgroundColor: 'white' }} >
                    <Card.Title style={{ marginLeft: 0 }} title="Marlo Marques" left={() => <Icon style={{ marginTop: -8 }} name="user" size={28} />} />
                    <Card.Content >
                        <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                            <Text variant="titleMedium" >Tipo de serviço: </Text>
                            <Chip >Corte Simples</Chip>
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                            <Text variant="titleMedium" >Status: </Text>
                            <Chip>Em andamento</Chip>
                        </View>
                    </Card.Content>
                    <Card.Actions style={{ marginTop: 20 }}>
                        <Button style={{width:'100%'}} mode='outlined' textColor='white' buttonColor='red'>Sair da fila</Button>
                    </Card.Actions>
                </Card>

                <View style={{ margin: 15, }}>
                    <Button icon="plus-circle" mode="contained" onPress={() => console.log('Pressed')}>
                        Adicionar
                    </Button>

                    <TextInput
                        outlineStyle={{ borderRadius: 10 }}
                        dense
                        label="Email"
                        value={text}
                        onChangeText={text => setText(text)}
                        mode="outlined"
                    />
                </View >



            </ScrollView>
        </View>
    );
};

export default Fila;
