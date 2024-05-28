import React, { useContext } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Text, Card, RadioButton } from 'react-native-paper';
import styles from './styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../contexts/auth';
import Overlay from '../../components/Ui/Overlay';
import InputCpf from '../../components/Ui/Input/inputCpf';
import {helper} from '../../helpers/inputs';


export default function SignUp() {
  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSignUp(data) {
    signUp(data)
  }


  const validationSchema = Yup.object().shape({
    profile_id: Yup.number()
      .required('Campo obrigatório'),
    name: Yup.string()
      .required('Campo obrigatório'),
    email: Yup.string()
      .email('E-mail inválido')
      .required('Campo obrigatório'),
    cpf: Yup.string()
      .required('Campo obrigatório')
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
    phone: Yup.string()
      .required('Campo obrigatório')
      .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Número de telefone inválido'),
    password: Yup.string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .required('Campo obrigatório'),
  });


  return (
    <View style={styles.background}>
      <Overlay isVisible={loadingAuth} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
        style={styles.container}>
        <Card style={styles.card} >
          <Card.Title title="Registrar" titleStyle={styles.titleCard} />
          <Card.Content>
            <Formik
              initialValues={{ name: '', cpf: '', email: '', password: '', profile_id: null, phone: null }}
              validationSchema={validationSchema}
              onSubmit={values => {
                handleSignUp(values)
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                <View>

                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Você é ?</Text>
                  <RadioButton.Group
                    onValueChange={(value) => setFieldValue('profile_id', value)}
                    value={values.profile_id}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                        <RadioButton value={3} />
                        <Text>Profissional</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value={2} />
                        <Text>Cliente</Text>
                      </View>
                    </View>
                  </RadioButton.Group>
                  {touched.profile_id && errors.profile_id && <Text style={styles.errorText}>{errors.profile_id}</Text>}

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


                  <InputCpf
                    label='CPF'
                    name='cpf'
                  />

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
                    keyboardType='numeric'
                    maxLength={15}
                  />
                  {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                  <TextInput
                    outlineStyle={{ borderRadius: 10 }}
                    style={styles.input}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry
                    mode="outlined"
                    label="Senha"
                    error={touched.password && Boolean(errors.password)}
                    left={<TextInput.Icon icon="lock-outline" />}
                    dense
                  />
                  {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}


                  <Button
                    style={styles.button}
                    mode="contained"
                    icon='content-save-outline'
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
  )
}
