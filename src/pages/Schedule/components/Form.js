import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Button, Text, Card, IconButton } from 'react-native-paper';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import Overlay from '../../../components/Ui/Overlay';
import { helper } from '../../../helpers/inputs';
import api from "../../../services";
import { useDispatch, useSelector } from 'react-redux';
import { infoModal, reloadItemsCard } from '../reducer';
import { setSnackbar } from '../../../store/globalSlice';
import TimePickerField from '../../../components/Ui/Input/TimePickerField';
import { Dropdown } from 'react-native-element-dropdown';
import { useIsFocused } from '@react-navigation/native';

export default function Form() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  const [userId, setUserId] = useState(null);
  const isFocused = useIsFocused();
  const [isFocus, setIsFocus] = useState(false);
  const [itemsService, setItemsService] = useState([]);
  const [itemsUsers, setItemsUsers] = useState([]);
  const modalForm = useSelector((state) => state.schedule.modal);

  const typeSchedule = modalForm?.data?.typeSchedule;

  const validationSchema = Yup.object().shape({
    time: typeSchedule == 'HM' ? Yup.string().required('Campo obrigatório') :  Yup.string() ,
    service_id: Yup.string().required('Campo obrigatório'),
    user_id: Yup.string().required('Campo obrigatório'),
  });
  


  useEffect(() => {
    if (isFocused) {
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
      const { status } = modalForm?.data?.id == null
        ? await api.post('/list', obj)
        : await api.put(`/list/${modalForm.data.id}`, obj);

      if (status == 201 || status == 200) {
        dispatch(reloadItemsCard(true));
        closeModal();
        dispatch(setSnackbar({ visible: true, title: modalForm?.data?.id == null ? 'Adicionado com sucesso!' : 'Alterado com sucesso!' }));
      }
    } catch (error) {
      console.log('erro ao salvar estabelecimento', error);
    } finally {
      setLoading(false);
    }
  }

  const titleForm = () => (modalForm.action === 'edit' ? 'Editar Agendamento' : 'Novo Agendamento');

  const renderLabel = () => {
    if (serviceId && isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'rgb(0, 104, 116)' }]}>
          Serviço
        </Text>
      );
    }
    return null;
  };

  const renderLabelUser = () => {
    if (userId && isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'rgb(0, 104, 116)' }]}>
          Pessoa
        </Text>
      );
    }
    return null;
  };

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
              initialValues={{ time: '', service_id: '', user_id: '', }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                saveForm(values);
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => {
                useEffect(() => {
                  if (modalForm.action == 'edit') {
                    setFieldValue('time', helper.formatTime(modalForm.data.time));
                  }
                }, [modalForm.action]);

                return (
                  <View>
                    <View style={styles.containerDropdown}>
                      {renderLabelUser()}
                      <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'rgb(0, 104, 116)' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={itemsUsers}
                        search
                        maxHeight={300}
                        labelField="user.name"
                        valueField="user.id"
                        placeholder={'Selecione a pessoa'}
                        searchPlaceholder="Pesquisar..."
                        value={values.user_id}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setFieldValue('user_id', item.user.id);
                          setUserId(item.user.id);
                          setIsFocus(false);
                        }}
                      />
                      {touched.user_id && errors.user_id && <Text style={styles.errorText}>{errors.user_id}</Text>}
                    </View>

                    <View style={[styles.containerDropdown, { marginBottom: 30 }]}>
                      {renderLabel()}
                      <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'rgb(0, 104, 116)' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={itemsService}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="id"
                        placeholder={'Selecione o serviço'}
                        searchPlaceholder="Pesquisar..."
                        value={values.service_id}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setFieldValue('service_id', item.id);
                          setServiceId(item.id);
                          setIsFocus(false);
                        }}
                      />
                      {touched.service_id && errors.service_id && <Text style={styles.errorText}>{errors.service_id}</Text>}
                    </View>


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
    top: 15
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
