import React, { useContext } from 'react';
import { View, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import styles from './styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Overlay from '../../components/Ui/Overlay';
import Input from '../../components/Ui/Input/input';
import FormButton from '../../components/Ui/Button/FormButton';

import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';




export default function SignIn() {
  const navigation = useNavigation();
  const { signIn, loadingAuth } = useContext(AuthContext);

  function handleLogin(value) {
    signIn(value)
  }


  const validationSchema = Yup.object().shape({
    cpf: Yup.string()
      .required('O cpf é obrigatório'),
    password: Yup.string()
      .required('A senha é obrigatória'),
  });

  return (
    <View style={styles.background}>
      <Overlay isVisible={loadingAuth} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
        style={styles.container}>

        <Image style={styles.logo} source={require('../../assets/logo1.png')} />

        <Formik
          initialValues={{ cpf: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={values => {
            handleLogin(values)
          }}
        >
          {({ handleSubmit }) => (
            <View>
              <Input
                label="CPF"
                name="cpf"
              />

              <Input
                label="Senha"
                name="password"
              />

              <FormButton
                title='Login'
                icon='login'
                mode="contained"
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>

        <TouchableOpacity style={styles.link}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.textLink}>Criar conta</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </View>
  )
}
