import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Button, Text, Card, IconButton } from 'react-native-paper';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import Overlay from '../../../components/Ui/Overlay';
import api from "../../../services";
import { useDispatch, useSelector } from 'react-redux';
import { infoModal, reloadItemsCard } from '../reducer';
import { setSnackbar } from '../../../store/globalSlice';
import TimePickerField from '../../../components/Ui/Input/TimePickerField';
import { useIsFocused } from '@react-navigation/native';
import Dropdown from '../../../components/Ui/Input/DropdownFormik';
import { useRewardedAd } from '../../../components/AdsMob/hooks/useRewardedAd';
import { checkEstablishmentPayment } from '../../../helpers/checkPayment';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Form() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [itemsService, setItemsService] = useState([]);
  const [itemsUsers, setItemsUsers] = useState([]);
  const modalForm = useSelector((state) => state.schedule.modal);
  const { showAd, isLoading } = useRewardedAd();
  const typeSchedule = modalForm?.data?.typeSchedule;
  const [user, setUser] = useState(null);

  const validationSchema = Yup.object().shape({
    time: typeSchedule == 'HM' ? Yup.string().required('Campo obrigatório') : Yup.string(),
    service_id: Yup.string().required('Campo obrigatório'),
    user_id: Yup.string().required('Campo obrigatório'),
  });



  const handleShowRewardedAd = async () => {
    if (!isLoading) {
      await showAd();
    }
  };
  const dataUser = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'))
    setUser(user)
  };

  useEffect(() => {
    if (isFocused) {
      dataUser();
      getServices();
      getAllUsers();
    }

    return () => { };
  }, [isFocused]);

  const getServices = async () => {
    const response = await api.get(`/combo/servicesByEstablishment/${modalForm.data.establishment_id}`);

    if (response.status == 200) {
      setItemsService(response.data);
    }
  };

  const getAllUsers = async () => {
    const response = await api.get(`/combo/userByEstablishiment/${modalForm.data.establishment_id}`);

    if (response.status == 200) {
      setItemsUsers(response.data);
    }
  };

  function closeModal() {
    dispatch(infoModal({ action: 'create', visible: false }));
  }

  async function saveForm(obj) {
    obj = { ...obj, ...modalForm.data }
    setLoading(true);
    try {
      const response = modalForm?.data?.id == null
        ? await api.post('/list', obj)
        : await api.put(`/list/${modalForm.data.id}`, obj);
      if (response.status == 201 || response.status == 200) {
        const data = await checkEstablishmentPayment(user.user.id)
        if (!data.userInPlan) {
          handleShowRewardedAd();
        }
        dispatch(reloadItemsCard(true));
        closeModal();
        dispatch(setSnackbar({ visible: true, title: 'Agendado com sucesso!' }));
      }
    } catch (error) {
      console.log('erro ao salvar agendamento', error);
      dispatch(setSnackbar({ visible: true, title: 'Erro ao agendar!' }));
    } finally {
      setLoading(false);
    }
  }


  return (
    <View>
      <Overlay isVisible={loading} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>
        <Card style={styles.card}>
          <Card.Title title={"Agendamento"} titleStyle={styles.titleCard}
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
              initialValues={{ time: '', service_id: '', user_id: '', }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                saveForm(values);
              }}
            >
              {({ handleSubmit, setFieldValue, values, errors, touched }) => {

                return (
                  <View>

                    <Dropdown
                      label="Pessoa"
                      data={itemsUsers}
                      placeholder="Selecione a pessoa"
                      value={values.user_id}
                      onChange={(value) => setFieldValue('user_id', value)}
                      labelField="name"
                      valueField="id"
                    />

                    {touched.user_id && errors.user_id && (
                      <Text style={styles.errorText}>{errors.user_id}</Text>
                    )}

                    <Dropdown
                      label="Serviço"
                      data={itemsService}
                      placeholder="Selecione o serviço"
                      value={values.service_id}
                      onChange={(value) => setFieldValue('service_id', value)}
                      labelField="name"
                      valueField="id"
                    />

                    {touched.service_id && errors.service_id && (
                      <Text style={styles.errorText}>{errors.service_id}</Text>
                    )}

                    {
                      typeSchedule == 'HM' && (
                        <Field
                          component={TimePickerField}
                          name="time"
                          label="Hora do agendamento"
                        />
                      )
                    }


                    <Button
                      style={styles.button}
                      mode="contained"
                      icon="content-save"
                      onPress={handleSubmit}
                    >
                      Agendar
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

const styles = StyleSheet.create({
  input: { marginBottom: 5, },
  errorText: {
    color: 'red',
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 8
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
  },
  card: {
    borderRadius: 15,
    margin: 5
  },
  titleCard: {
    marginLeft: 15,
    fontSize: 20,
    fontWeight: 'bold'
  },

  //dropdown
  containerDropdown: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: 'white',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
    top: 15,
    backgroundColor: 'white'
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 15,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 8,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
