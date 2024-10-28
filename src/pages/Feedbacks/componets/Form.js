import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Text, Card, RadioButton, IconButton } from 'react-native-paper';
import styles from '../styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Overlay from '../../../components/Ui/Overlay';
import { helper } from '../../../helpers/inputs';
import api from "../../../services";
import { useDispatch, useSelector } from 'react-redux';
import { infoModal, reloadItemsCard } from '../reducer';
import { setSnackbar } from '../../../store/globalSlice';
// import DateTimePicker from '@react-native-community/datetimepicker';


export default function Form({ establishmentId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const modalForm = useSelector((state) => state.service.modal);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Campo obrigatório'),
    amount: Yup.string().required('Campo obrigatório'),
  });

  function closeModal() {
    dispatch(infoModal({ action: 'create', visible: false }));
  }

  async function saveForm(obj) {
    obj.establishment_id = establishmentId

    if (modalForm?.data?.id == null) {
      setLoading(true);
      try {
        const { status } = await api.post('/services', obj);

        if (status == 201) {
          dispatch(reloadItemsCard(true));
          closeModal()
          dispatch(setSnackbar({ visible: true, title: 'Adicionado com sucesso!' }));
          setLoading(false);
        }

      } catch (error) {
        console.log('erro ao adicionar serviço', error)
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const { status } = await api.put(`/services/${modalForm.data.id}`, obj);

        if (status == 200) {
          dispatch(reloadItemsCard(true));
          closeModal()
          dispatch(setSnackbar({ visible: true, title: 'Alterado com sucesso!' }));
          setLoading(false);
        }

      } catch (error) {
        console.log('erro ao alterar serviço', error)
        setLoading(false);
      }

    }
  }

  const titleForm = () => {
    return modalForm.action == 'edit' ? 'Editar Serviço' : 'Novo Serviço'
  }

  return (
    <View>
      <Overlay isVisible={loading} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>
        <Card style={styles.card}>
          <Card.Title title={titleForm()} titleStyle={styles.titleCard}
            right={(props) => (
              <IconButton
                {...props}
                icon="close"
                size={24}
                onPress={closeModal}
              />
            )}
          />
          <Card.Content>
            <Formik
              initialValues={{ name: '', amount: "", time:"" }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                values.amount = helper.formatMoneyRemoveCaracters(values.amount);
                saveForm(values);
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => {
                useEffect(() => {
                  if (modalForm.action == 'edit') {
                    setFieldValue('name', modalForm.data.name);
                    setFieldValue('amount', helper.formatMoney(modalForm.data.amount));
                    setFieldValue('time', helper.formatTime(modalForm.data.time));
                  }

                }, [modalForm.action]);

                return (
                  <View>
                    <TextInput
                      outlineStyle={{ borderRadius: 10 }}
                      style={styles.input}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      mode="outlined"
                      label="Nome"
                      dense
                      error={touched.name && Boolean(errors.name)}
                    />
                    {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}


                    <TextInput
                      outlineStyle={{ borderRadius: 10 }}
                      style={styles.input}
                      onChangeText={(text) => setFieldValue('amount', helper.formatMoney(text))}
                      onBlur={handleBlur('amount')}
                      value={values.amount}
                      mode="outlined"
                      label="Valor"
                      keyboardType="numeric"
                      dense
                      error={touched.amount && Boolean(errors.amount)}
                    />
                    {touched.amount && errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

                    <TextInput
                      outlineStyle={{ borderRadius: 10 }}
                      style={styles.input}
                      onChangeText={(text) => setFieldValue('time', helper.formatTime(text))}
                      onBlur={handleBlur('time')}
                      value={values.time}
                      mode="outlined"
                      label="Quanto tempo gasta"
                      dense
                      keyboardType="numeric"
                      maxLength={5}
                      error={touched.time && Boolean(errors.time)}
                    />
                    {touched.time && errors.time && <Text style={styles.errorText}>{errors.time}</Text>}

                    <Button
                      style={styles.button}
                      mode="contained"
                      icon="content-save"
                      onPress={handleSubmit}
                    >
                      Salvar
                    </Button>
                  </View>
                );
              }}
            </Formik>
          </Card.Content>
        </Card>
      </KeyboardAvoidingView>
    </View>
  );
}
