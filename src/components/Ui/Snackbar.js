import React from 'react';
import { Snackbar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { setSnackbar } from '../../store/globalSlice';

function AlertSnackbar() {
    const visible = useSelector((state) => state.global.snackbar.visible);
    const title = useSelector((state) => state.global.snackbar.title);
    const dispatch = useDispatch();

    const onDismissSnackBar = () => {
        dispatch(setSnackbar({ visible: false }));
    };

    return (
        <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            duration={2000} 
            action={{
                textColor: 'white',
                label: 'Fechar',
            }}>
            {title}
        </Snackbar>
    );
}

export default AlertSnackbar;
