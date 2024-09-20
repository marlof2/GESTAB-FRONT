import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Button, TextInput, Text, Card } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Overlay from '../../../components/Ui/Overlay';
import Header from '../../../components/Header';
import api from '../../../services';

export default function ChangePassword({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para a visibilidade da confirmação da senha
  const [showOldPassword, setShowOldPassword] = useState(false); // Estado para a visibilidade da confirmação da senha
  const { id } = route.params.user;

  async function savePassword(values) {
    setLoading(true);

    const obj = {
      confirmaSenhaNova: values.confirmPassword,
      senhaAntiga: values.oldPassword,
      senhaNova: values.newPassword,
      id:id
    }

    try {
      response = await api.post(`/users/alterarsenha`, obj);

      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('ListProfile');
      }

    } catch (error) {
      console.log('Erro ao alterar a senha', error);
      setLoading(false);
    }
  }

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required('Campo obrigatório'),
    newPassword: Yup.string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .required('Campo obrigatório'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'As senhas não são iguais')
      .required('Campo obrigatório'),
  });

  return (
    <View style={styles.background}>
      <Header title={'Alterar Senha'} />
      <Overlay isVisible={loading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
        style={styles.container}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Formik
              initialValues={{
                newPassword: '',
                confirmPassword: '',
                oldPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                savePassword(values);
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  <TextInput
                    outlineStyle={{ borderRadius: 10 }}
                    style={styles.input}
                    onChangeText={handleChange('oldPassword')}
                    onBlur={handleBlur('oldPassword')}
                    value={values.oldPassword}
                    mode="outlined"
                    label="Senha Antiga"
                    secureTextEntry={!showOldPassword}
                    right={
                      <TextInput.Icon
                        icon={showOldPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowOldPassword(!showOldPassword)}
                      />
                    }
                    error={touched.oldPassword && Boolean(errors.oldPassword)}
                  />
                  {touched.oldPassword && errors.oldPassword && (
                    <Text style={styles.errorText}>{errors.oldPassword}</Text>
                  )}

                  <TextInput
                    outlineStyle={{ borderRadius: 10 }}
                    style={styles.input}
                    onChangeText={handleChange('newPassword')}
                    onBlur={handleBlur('newPassword')}
                    value={values.newPassword}
                    mode="outlined"
                    label="Nova Senha"
                    secureTextEntry={!showPassword}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                    error={touched.newPassword && Boolean(errors.newPassword)}
                  />
                  {touched.newPassword && errors.newPassword && (
                    <Text style={styles.errorText}>{errors.newPassword}</Text>
                  )}

                  <TextInput
                    outlineStyle={{ borderRadius: 10 }}
                    style={styles.input}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    mode="outlined"
                    label="Confirmar Senha"
                    secureTextEntry={!showConfirmPassword}
                    right={
                      <TextInput.Icon
                        icon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    }
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  )}

                  <Button
                    style={styles.button}
                    mode="contained"
                    icon="content-save-outline"
                    onPress={handleSubmit}
                  >
                    Salvar Senha
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

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 5,
  },
  card: {
    margin: 10,
    padding: 20,
    borderRadius: 10,
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#6200ee',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  titleCard: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

