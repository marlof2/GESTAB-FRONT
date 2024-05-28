import React, { useContext } from 'react';
import { View, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Button, Text, Card, TextInput } from 'react-native-paper';
import styles from './styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Overlay from '../../components/Ui/Overlay';

import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import InputCpf from '../../components/Ui/Input/inputCpf';




export default function SignIn() {
  const navigation = useNavigation();
  const { signIn, loadingAuth } = useContext(AuthContext);

  function handleLogin(value) {
    signIn(value)
  }


  const validationSchema = Yup.object().shape({
    cpf: Yup.string()
      .required('Campo obrigatório')
      .min(14, 'CPF incompleto'),
    password: Yup.string()
      .required('Campo obrigatório'),
  });

  return (
    <View style={styles.background}>
      <Overlay isVisible={loadingAuth} />
      <Image style={styles.logo} source={require('../../assets/logo1.png')} />
      {/* <Text style={{ marginBottom: 20, fontWeight: 'bold', fontSize: 16 }}>GLE - Gerênciamento de lista de estabelecimentos</Text> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
        style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Bem vindo !!" titleStyle={styles.titleCard} />
          <Card.Content>
            <Formik
              initialValues={{ cpf: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={values => {
                handleLogin(values)
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  <InputCpf
                    label='CPF'
                    name='cpf'
                  />

                  <TextInput
                    outlineStyle={{ borderRadius: 10 }}
                    style={styles.input}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    mode="outlined"
                    label="Senha"
                    dense
                    left={<TextInput.Icon icon="lock-outline" />}
                    secureTextEntry
                    error={touched.password && Boolean(errors.password)}
                  />
                  {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                  <Button
                    style={styles.button}
                    mode="contained"
                    icon='login'
                    onPress={handleSubmit}
                  >
                    Login
                  </Button>
                </View>
              )}
            </Formik>

            <View style={styles.footer}>
              <Text>Não tem uma conta?</Text>
              <Button
                onPress={() => navigation.navigate('SignUp')}
              >
                Criar conta
              </Button>
            </View>

          </Card.Content>
        </Card>

      </KeyboardAvoidingView>
    </View>
  )
}
