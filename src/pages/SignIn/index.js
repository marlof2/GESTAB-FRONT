import React, { useContext, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Button, Text, Card, TextInput } from 'react-native-paper';
import styles from './styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Overlay from '../../components/Ui/Overlay';
import { useIsFocused } from '@react-navigation/native';

import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import InputCpf from '../../components/Ui/Input/inputCpf';
import { StatusBar } from 'react-native';
import theme from '../../../src/themes/theme.json'
import Snackbar from '../../components/Ui/Snackbar';




export default function SignIn() {
  const navigation = useNavigation();
  const { signIn, loadingAuth } = useContext(AuthContext);
  const isFocused = useIsFocused();

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

  useEffect(() => {
    if (isFocused) {
      StatusBar.setBackgroundColor(theme.colors.primary);
    }
  }, [isFocused]);

  return (
    <View style={styles.background}>
      <Overlay isVisible={loadingAuth} />
      <Image style={styles.logo} source={require('../../assets/gestab.jpg')} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
        style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="😎 Bem vindo !" titleStyle={styles.titleCard} />
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
              <Text>Ainda não tem acesso?</Text>
              <Button
                onPress={() => navigation.navigate('SignUp')}
              >
                Crie seu acesso.
              </Button>
              
              <View style={styles.divider} />
              
              <Button
                // onPress={() => navigation.navigate('HomeScreenAds')}
                onPress={() => navigation.navigate('ForgotPassword')}
                mode="text"
                compact
              >
                Esqueci minha senha
              </Button>
            </View>

          </Card.Content>
        </Card>
      </KeyboardAvoidingView>
      <Snackbar />
    </View>
  )
}
