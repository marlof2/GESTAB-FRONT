import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Text, Card } from 'react-native-paper';
import styles from '../styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Overlay from '../../../components/Ui/Overlay';
import { helper } from '../../../helpers/inputs';
import Header from '../../../components/Header';
import api from '../../../services';

export default function UserProfileEdit({ navigation, route }) {
  const [loading, setLoading] = useState(false)
  const { 
    id,
    name,
    email,
    phone, } = route.params.user;



  async function saveForm(obj) {
    setLoading(true);

    try {
      const { status } = await api.patch(`/users/${id}`, obj);

      if (status == 200) {
        setLoading(false);
        navigation.navigate('ListProfile');
      }

    } catch (error) {
      console.log('erro ao alterar dados do perfil', error)
      setLoading(false);
    }

  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Campo obrigatório'),
    email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
    phone: Yup.string()
      .required('Campo obrigatório')
      .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Número de telefone inválido'),
  });

  return (
    <View style={styles.background}>
      <Header title={'Editar Perfil'} />
      <Overlay isVisible={loading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
        style={styles.container}
      >
        <Card style={styles.card}>
          <Card.Title title="👤 Dados do Usuário" titleStyle={styles.titleCard} />
          <Card.Content>
            <Formik
              initialValues={{
                name: name || '',
                email: email || '',
                phone: helper.maskPhone(phone) || '',
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                saveForm(values);
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
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
                    left={<TextInput.Icon icon="account-outline" />}
                    error={touched.name && Boolean(errors.name)}
                  />
                  {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}


                  <TextInput
                    outlineStyle={{ borderRadius: 10 }}
                    style={styles.input}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    mode="outlined"
                    label="E-mail"
                    dense
                    error={touched.email && Boolean(errors.email)}
                    left={<TextInput.Icon icon="email-outline" />}
                  />
                  {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

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
                    left={<TextInput.Icon icon="phone-outline" />}
                    keyboardType="numeric"
                    maxLength={15}
                  />
                  {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                  <Button
                    style={styles.button}
                    mode="contained"
                    icon="content-save-outline"
                    onPress={handleSubmit}
                  >
                    Salvar
                  </Button>
                </View>
              )}
            </Formik>
          </Card.Content>
        </Card>
      </KeyboardAvoidingView>
    </View>
  );
}
