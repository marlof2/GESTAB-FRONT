import React, { useContext } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, TextInput, Text, Surface, SegmentedButtons } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../contexts/auth';
import InputCpf from '../../components/Ui/Input/inputCpf';
import { helper } from '../../helpers/inputs';
import theme from '../../themes/theme.json';

export default function CompleteProfile({ route }) {
  const { completeGoogleProfile, loadingAuth } = useContext(AuthContext);
  const { googleData } = route.params;

  const validationSchema = Yup.object().shape({
    profile_id: Yup.number().required('Campo obrigatório'),
    cpf: Yup.string()
      .required('Campo obrigatório')
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Formato de CPF inválido'),
    phone: Yup.string()
      .required('Campo obrigatório')
      .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Número de telefone inválido'),
    type_schedule: Yup.string().when('profile_id', {
      is: (value) => value === 3,
      then: (schema) => schema.required('Campo obrigatório'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleComplete = async (values) => {
    const data = {
      ...values,
      ...googleData,
      cpf: values.cpf.replace(/[-.]/g, ''),
    };
    await completeGoogleProfile(data);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Surface style={{ padding: 16, marginBottom: 24 }}>
            <Text variant="headlineMedium">Complete seu perfil</Text>
            <Text variant="bodyMedium">
              Precisamos de algumas informações adicionais para continuar
            </Text>
          </Surface>

          <Formik
            initialValues={{
              profile_id: null,
              cpf: '',
              phone: '',
              type_schedule: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleComplete}
          >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
              <View>
                <Text variant="titleMedium" style={{ marginBottom: 8 }}>Tipo de Conta</Text>
                <SegmentedButtons
                  value={values.profile_id}
                  onValueChange={value => {
                    setFieldValue('profile_id', value);
                    if (value === 2) setFieldValue('type_schedule', null);
                  }}
                  buttons={[
                    { value: 3, label: 'Profissional' },
                    { value: 2, label: 'Cliente' },
                  ]}
                />

                {values.profile_id === 3 && (
                  <>
                    <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8 }}>
                      Tipo de Agenda
                    </Text>
                    <SegmentedButtons
                      value={values.type_schedule}
                      onValueChange={value => setFieldValue('type_schedule', value)}
                      buttons={[
                        { value: 'HM', label: 'Horário Marcado' },
                        { value: 'OC', label: 'Ordem de Chegada' },
                      ]}
                    />
                  </>
                )}

                <InputCpf
                  label="CPF"
                  name="cpf"
                  style={{ marginTop: 16 }}
                  leftColor={theme.colors.primary}
                />

                <TextInput
                  style={{ marginTop: 16 }}
                  mode="outlined"
                  label="Celular"
                  value={values.phone}
                  onChangeText={(text) => setFieldValue('phone', helper.maskPhone(text))}
                  error={touched.phone && errors.phone}
                  left={<TextInput.Icon icon="phone" />}
                  keyboardType="numeric"
                  maxLength={15}
                />

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loadingAuth}
                  style={{ marginTop: 24 }}
                >
                  Concluir cadastro
                </Button>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 