import React, { useState } from 'react';
import { Snackbar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../../pages/Establishment/reducer/slice';

function AlertSnackbar() {
    const visible = useSelector((state) => state.establishment.snackbar.visible);
    const title = useSelector((state) => state.establishment.snackbar.title);
    const dispatch = useDispatch();

    const onDismissSnackBar = () => {
        dispatch(setSnackbar({ visible: false }))
    }

    return (
        <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            action={{
                label: 'Fechar',
                // onPress: () => {
                // Do something
                // },
            }}>
            {title}
        </Snackbar>
    );
};


export default AlertSnackbar;