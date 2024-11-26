import React, { useContext } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, TextInput, Text, Surface, SegmentedButtons } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../contexts/auth';
import Overlay from '../../components/Ui/Overlay';
import InputCpf from '../../components/Ui/Input/inputCpf';
import { helper } from '../../helpers/inputs';
import { useNavigation } from '@react-navigation/native';
import theme from '../../themes/theme.json';

function isValidCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;

  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  // Segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

function isValidEmail(email) {
  // Remove espaços em branco
  email = email.trim();

  // Regex para validar formato básico do email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;

  
  // Lista de domínios válidos comuns
  const validDomains = [
    'gmail.com',
    'yahoo.com',
    'yahoo.com.br',
    'hotmail.com',
    'outlook.com',
    'live.com',
    'icloud.com',
    'uol.com.br',
    'bol.com.br',
    'terra.com.br',
    'ig.com.br',
    'globo.com',
    'protonmail.com',
    'outlook.com.br'
  ];

  const domain = email.split('@')[1].toLowerCase();
  
  // Verifica se o domínio está na lista de válidos
  if (!validDomains.includes(domain)) return false;

  return true;
}

export default function SignUp() {
  const { signUp, loadingAuth } = useContext(AuthContext);
  const navigation = useNavigation();

  function handleSignUp(data) {
    data.cpf = data.cpf.replace(/[-.]/g, '');
    signUp(data);
    data.cpf = helper.maskCpf(data.cpf);
  }

  const validationSchema = Yup.object().shape({
    profile_id: Yup.number().required('Campo obrigatório'),
    name: Yup.string().required('Campo obrigatório'),
    email: Yup.string()
      .required('Campo obrigatório')
      .email('E-mail inválido')
      .test('email', 'E-mail inválido', value => {
        if (!value) return false;
        return isValidEmail(value);
      }),
    cpf: Yup.string()
      .required('Campo obrigatório')
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Formato de CPF inválido')
      .test('cpf', 'CPF inválido', value => {
        if (!value) return false;
        return isValidCPF(value);
      }),
    phone: Yup.string()
      .required('Campo obrigatório')
      .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Número de telefone inválido'),
    password: Yup.string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .required('Campo obrigatório'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'As senhas devem coincidir')
      .required('Confirmação de senha é obrigatória'),
    type_schedule: Yup.string().when('profile_id', {
      is: (value) => value === 3,
      then: (schema) => schema.required('Campo obrigatório'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Overlay isVisible={loadingAuth} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Surface style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>Criar Conta</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Preencha seus dados para começar
            </Text>
          </Surface>

          <Formik
            initialValues={{
              name: '',
              cpf: '',
              email: '',
              password: '',
              confirmPassword: '',
              profile_id: null,
              phone: null,
              type_schedule: null,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              handleSignUp(values);
            }}
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

                {values.profile_id == 3 && (
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
                  <TextInput
                  outlineStyle={{ borderRadius: 10 }}
                    mode="outlined"
                    label="Nome Completo"
                    dense
                    style={styles.input}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    error={touched.name && Boolean(errors.name)}
                    left={<TextInput.Icon icon="account" color={theme.colors.primary} />}
                  />
                  {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                  <InputCpf label="CPF" name="cpf" leftColor={theme.colors.primary} />

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
                    left={<TextInput.Icon icon="email-outline" color={theme.colors.primary} />}
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
                    left={<TextInput.Icon icon="phone-outline" color={theme.colors.primary} />}
                    keyboardType="numeric"
                    maxLength={15}
                  />
                  {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                </View>

                <View style={styles.inputGroup}>
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
                    left={<TextInput.Icon icon="lock-outline" color={theme.colors.primary} />}
                    dense
                  />
                  {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                  <TextInput
                    outlineStyle={{ borderRadius: 10 }}
                    style={styles.input}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    secureTextEntry
                    mode="outlined"
                    label="Confirmar Senha"
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    left={<TextInput.Icon icon="lock-check-outline" color={theme.colors.primary} />}
                    dense
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    contentStyle={styles.buttonContent}
                  >
                    Criar Conta
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => navigation.navigate('SignIn')}
                    style={styles.backButton}
                    contentStyle={styles.buttonContent}
                  >
                    Já tenho uma conta
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
