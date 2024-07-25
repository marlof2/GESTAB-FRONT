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


export default function Form() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const modalForm = useSelector((state) => state.establishment.modal);


  const validationSchema = Yup.object().shape({
    type_of_person_id: Yup.number().required('Campo obrigatório'),
    name: Yup.string().required('Campo obrigatório'),
    responsible: Yup.string().required('Campo obrigatório'),
    type_schedule: Yup.string().required('Campo obrigatório'),
    cpf: Yup.string().when('type_of_person_id', {
      is: (value) => value === 1, // Ajuste este valor conforme a lógica do seu sistema
      then: (schema) => schema
        .required('Campo obrigatório')
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
      otherwise: (schema) => schema.notRequired(),
    }),
    cnpj: Yup.string().when('type_of_person_id', {
      is: (value) => value === 2, // Ajuste este valor conforme a lógica do seu sistema
      then: (schema) => schema
        .required('Campo obrigatório')
        .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  function closeModal() {
    dispatch(infoModal({ action: 'create', visible: false }));

  }

  async function saveForm(obj) {

    if (modalForm?.data?.id == null) {
      setLoading(true);
      try {
        const { status } = await api.post('/establishments', obj);

        if (status == 201) {
          dispatch(reloadItemsCard(true));
          closeModal()
          dispatch(setSnackbar({ visible: true, title: 'Adicionado com sucesso!' }));
          setLoading(false);
        }

      } catch (error) {
        console.log('erro ao adicionar estabelecimento', error)
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const { status } = await api.put(`/establishments/${modalForm.data.id}`, obj);

        if (status == 200) {
          dispatch(reloadItemsCard(true));
          closeModal()
          dispatch(setSnackbar({ visible: true, title: 'Alterado com sucesso!' }));
          setLoading(false);
        }

      } catch (error) {
        console.log('erro ao alterar estabelecimento', error)
        setLoading(false);
      }

    }
  }

  const titleForm = () => {
   return modalForm.action == 'edit' ? 'Editar Estabelecimento' : 'Novo Estabelecimento'
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
              initialValues={{ name: '', type_of_person_id: 1, phone: '', cpf: '', cnpj: '', responsible: '', type_schedule:'' }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                saveForm(values);
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => {
                useEffect(() => {
                  if (modalForm.action == 'edit') {
                    setFieldValue('type_of_person_id', modalForm.data.type_of_person_id);
                    setFieldValue('type_schedule', modalForm.data.type_schedule);
                    setFieldValue('responsible', modalForm.data.responsible);
                    setFieldValue('name', modalForm.data.name);
                    setFieldValue('cpf', helper.maskCpf(modalForm.data.cpf));
                    setFieldValue('cnpj', helper.maskCnpj(modalForm.data.cnpj));
                    setFieldValue('phone', helper.maskPhone(modalForm.data.phone));
                  }

                }, [modalForm.action]);

                return (
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Você é?</Text>
                    <RadioButton.Group
                      onValueChange={(value) => setFieldValue('type_of_person_id', value)}
                      value={values.type_of_person_id}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                          <RadioButton value={1} />
                          <Text>Pessoa Física</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <RadioButton value={2} />
                          <Text>Pessoa Jurídica</Text>
                        </View>
                      </View>
                    </RadioButton.Group>
                    {touched.type_of_person_id && errors.type_of_person_id && (
                      <Text style={styles.errorText}>{errors.type_of_person_id}</Text>
                    )}

                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Tipo de agenda</Text>
                    <RadioButton.Group
                      onValueChange={(value) => setFieldValue('type_schedule', value)}
                      value={values.type_schedule}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                          <RadioButton value={1} />
                          <Text>Horário marcado</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <RadioButton value={2} />
                          <Text>Ordem de chegada</Text>
                        </View>
                      </View>
                    </RadioButton.Group>
                    {touched.type_schedule && errors.type_schedule && (
                      <Text style={styles.errorText}>{errors.type_schedule}</Text>
                    )}

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
                      onChangeText={handleChange('responsible')}
                      onBlur={handleBlur('responsible')}
                      value={values.responsible}
                      mode="outlined"
                      label="Responsável"
                      dense
                      error={touched.responsible && Boolean(errors.responsible)}
                    />
                    {touched.responsible && errors.responsible && <Text style={styles.errorText}>{errors.responsible}</Text>}

                    {values?.type_of_person_id == 1 ? (
                      <View>
                        <TextInput
                          outlineStyle={{ borderRadius: 10 }}
                          style={styles.input}
                          onChangeText={(text) => setFieldValue('cpf', helper.maskCpf(text))}
                          onBlur={handleBlur('cpf')}
                          value={values.cpf}
                          mode="outlined"
                          label="CPF"
                          dense
                          maxLength={14}
                          error={touched.cpf && Boolean(errors.cpf)}
                          keyboardType="numeric"
                        />
                        {touched.cpf && errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
                      </View>
                    ) : (
                      <View>
                        <TextInput
                          outlineStyle={{ borderRadius: 10 }}
                          style={styles.input}
                          onChangeText={(text) => setFieldValue('cnpj', helper.maskCnpj(text))}
                          onBlur={handleBlur('cnpj')}
                          value={values.cnpj}
                          mode="outlined"
                          label="CNPJ"
                          dense
                          maxLength={18}
                          error={touched.cnpj && Boolean(errors.cnpj)}
                          keyboardType="numeric"
                        />
                        {touched.cnpj && errors.cnpj && <Text style={styles.errorText}>{errors.cnpj}</Text>}
                      </View>
                    )}

                    <TextInput
                      outlineStyle={{ borderRadius: 10 }}
                      style={styles.input}
                      onChangeText={(text) => setFieldValue('phone', helper.maskPhone(text))}
                      onBlur={handleBlur('phone')}
                      value={values.phone}
                      mode="outlined"
                      label="Celular"
                      dense
                      error={touched.phone && Boolean(errors.phone)}
                      keyboardType="numeric"
                      maxLength={15}
                    />
                    {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

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
