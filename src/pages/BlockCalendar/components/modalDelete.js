import React from 'react';
import { Button, Card, Modal, Portal, Text, IconButton } from 'react-native-paper';
import theme from '../../../themes/theme.json';

export default function ModalDelete({ visible, onDismiss, onConfirm, title, message }) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{ padding: 20 }}>
        <Card style={{ borderRadius: 8 }}>
          <Card.Title
            titleStyle={{ fontWeight: 'bold' }}
            title={title}
            left={(props) => <IconButton {...props} icon="alert-circle" iconColor={theme.colors.error} />}
          />
          <Card.Content>
            <Text style={{ fontSize: 16, marginBottom: 20 }}>{message}</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="outlined" onPress={onDismiss} style={{ marginTop: 10, borderRadius: 10 }}>
              Cancelar
            </Button>
            <Button 
              mode="contained" 
              onPress={onConfirm} 
              style={{ marginTop: 10, borderRadius: 10 }} 
              buttonColor={theme.colors.error}
            >
              Confirmar
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}