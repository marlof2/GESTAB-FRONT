import React, { useContext } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import styles from './styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../contexts/auth';
import Overlay from '../../components/Ui/Overlay';
import Input from '../../components/Ui/Input/input';
import FormButton from '../../components/Ui/Button/FormButton';
import InputCpf from '../../components/Ui/Input/inputCpf';





export default function SignUp() {
  // const navigation = useNavigation();
  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSignUp(data) {
    signUp(data)
  }


  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('O nome é obrigatório'),
    email: Yup.string()
      .email('Digite um email válido')
      .required('O e-mail é obrigatório'),
    cpf: Yup.string()
      .required('O CPF é obrigatório')
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
    password: Yup.string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .required('A senha é obrigatória'),
  });



  return (
    <View style={styles.background}>
      <Overlay isVisible={loadingAuth} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
        style={styles.container}>

        <Formik
          initialValues={{ name: '', cpf: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={values => {
            handleSignUp(values)
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <Input
                name="name"
                label="Nome"
              />

              <InputCpf
                label='CPF'
                name='cpf'
              />


              <View style={styles.areaInput}>
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
                />
              </View>
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <View style={styles.areaInput}>
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
                  dense
                />
              </View>
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}


              <FormButton
                title='Salvar'
                icon='content-save-outline'
                mode="contained"
                onPress={handleSubmit}
              />

            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </View>
  )
}
