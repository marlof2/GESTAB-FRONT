import React, { useContext, useState } from 'react';
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
import { StyleSheet } from 'react-native';
import api from '../../services';
import { setSnackbar } from '../../store/globalSlice';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export default function CompleteProfile() {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

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
  async function handleUpdateProfile(data) {
    try {
      setLoading(true);
      data.cpf = data.cpf.replace(/[-.]/g, '');
      data.phone = data.phone.replace(/[()-\s]/g, '');
      data.need_profile_complete = false;
      delete data.need_update_password;

      const result = await api.patch(`/users/${user.user.id}`, data);

      if (result?.status === 200) {
        navigation.navigate('SelectEstablishment');
      }
    } catch (error) {
      dispatch(setSnackbar({
        visible: true,
        title: 'Erro ao atualizar perfil',
        type: 'error',
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Surface style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>Completar Perfil</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Atualize suas informações
            </Text>
          </Surface>

          <Formik
            initialValues={{
              profile_id: user?.profile_id || null,
              cpf: user?.cpf ? helper.maskCpf(user.cpf) : '',
              phone: user?.phone ? helper.maskPhone(user.phone) : '',
              type_schedule: user?.type_schedule || null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleUpdateProfile}
          >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
              <View style={styles.formContainer}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Tipo de Conta</Text>
                <SegmentedButtons
                  value={values.profile_id}
                  onValueChange={value => {
                    setFieldValue('profile_id', value);
                    if (value === 2) {
                      setFieldValue('type_schedule', null);
                    }
                  }}
                  buttons={[
                    { value: 3, label: 'Profissional' },
                    { value: 2, label: 'Cliente' },
                  ]}
                  style={styles.segmentedButton}
                />
                {touched.profile_id && errors.profile_id && (
                  <Text style={styles.errorText}>{errors.profile_id}</Text>
                )}

                {values.profile_id === 3 && (
                  <>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Tipo de Agenda</Text>
                    <SegmentedButtons
                      value={values.type_schedule}
                      onValueChange={value => setFieldValue('type_schedule', value)}
                      buttons={[
                        { value: 'HM', label: 'Horário Marcado' },
                        { value: 'OC', label: 'Ordem de Chegada' },
                      ]}
                      style={styles.segmentedButton}
                    />
                    {touched.type_schedule && errors.type_schedule && (
                      <Text style={styles.errorText}>{errors.type_schedule}</Text>
                    )}
                  </>
                )}

                <View style={styles.inputGroup}>
                  <InputCpf
                    label="CPF"
                    name="cpf"
                    leftColor={theme.colors.primary}
                    initialValue={values.cpf}
                  />

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
                    left={<TextInput.Icon icon="phone-outline" color={theme.colors.primary} />}
                    keyboardType="numeric"
                    maxLength={15}
                  />
                  {touched.phone && errors.phone && (
                    <Text style={styles.errorText}>{errors.phone}</Text>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    contentStyle={styles.buttonContent}
                    loading={loading}
                  >
                    Atualizar Perfil
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
    marginBottom: 24,
  },
  title: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.secondary,
  },
  formContainer: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    color: theme.colors.primary,
  },
  segmentedButton: {
    marginBottom: 16,
  },
  inputGroup: {
    gap: 16,
  },
  input: {
    backgroundColor: '#fff',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: -12,
    marginLeft: 8,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 24,
  },
  submitButton: {
    borderRadius: 10,
  },
  buttonContent: {
    paddingVertical: 6,
  },
});





