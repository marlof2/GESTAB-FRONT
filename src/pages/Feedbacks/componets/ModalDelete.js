import { Button, Card, Modal, Portal, Text, IconButton } from "react-native-paper";
import { useSelector, useDispatch } from 'react-redux';
import { reloadItemsCard, infoModalDelete } from '../reducer';
import theme from '../../../themes/theme.json'
import { setSnackbar } from '../../../store/globalSlice';
import { useState } from "react";
import api from "../../../services";
import { View } from "react-native";


export default function ModalDelete() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const modalDelete = useSelector((state) => state.service.modalDelete);

    const closeModal = () => {
        dispatch(infoModalDelete({ visible: false }));
    }

    const deleteItem = async () => {
        setLoading(true);
        try {
            const { status } = await api.delete(`/services/${modalDelete.id}`);

            if (status == 200) {
                dispatch(reloadItemsCard(true));
                closeModal()
                dispatch(setSnackbar({ visible: true, title: 'Deletado com sucesso!' }));
                setLoading(false);
            }

        } catch (error) {
            console.log('erro ao deletar o serviço', error)
            setLoading(false);
        }
    }

    return (
        <View>
            <Portal>
                <Modal visible={modalDelete.visible} dismissable={!modalDelete.visible} contentContainerStyle={{ padding: 20, }}>
                    <Card style={{ borderRadius: 8, }}>
                        <Card.Title
                            titleStyle={{ fontWeight: 'bold', }}
                            title="Deseja Deletar?"
                            left={(props) => <IconButton {...props} icon="alert-circle" iconColor={theme.colors.error} />}
                        />
                        <Card.Content>
                            <Text style={{
                                fontSize: 16,
                                marginBottom: 20,
                            }}>Essa ação não poderá ser desfeita?</Text>
                        </Card.Content>
                        <Card.Actions >
                            <Button disabled={loading} loading={loading} mode="outlined" onPress={closeModal} style={{ marginTop: 10, borderRadius: 10 }}>
                                Cancelar
                            </Button>
                            <Button disabled={loading} loading={loading} mode="contained" onPress={deleteItem} style={{ marginTop: 10, borderRadius: 10 }} buttonColor={theme.colors.error}>
                                Confirmar
                            </Button>
                        </Card.Actions>
                    </Card>
                </Modal>
            </Portal>
        </View>
    )
}