import React, { useContext, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
import { Button, Text, TextInput, Surface, IconButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Overlay from '../../components/Ui/Overlay';
import { useIsFocused } from '@react-navigation/native';

import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import InputCpf from '../../components/Ui/Input/inputCpf';
import theme from '../../../src/themes/theme.json'
import Snackbar from '../../components/Ui/Snackbar';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../../store/globalSlice';
import api from '../../services/';




export default function SignIn() {
  const navigation = useNavigation();
  const { signIn, signInWithGoogle, loadingAuth } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Configura o listener para URLs recebidas
    const subscription = Linking.addEventListener('url', handleUrl);

    // Verifica se o app foi aberto por uma URL
    Linking.getInitialURL().then(url => {
      if (url) {
        handleUrl({ url });
      }
    });

    // Cleanup: remove o listener quando o componente for desmontado
    return () => {
      subscription.remove();
    };
  }, []);

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
      // StatusBar.setBackgroundColor(theme.colors.primary);
    }
  }, [isFocused]);

  async function handleGoogleLogin() {
    try {
      setIsLoading(true);

      const redirectUrl = Linking.createURL('SignIn', {
        scheme: 'com.marlof2.gestab'
      });

      const { data: { auth_url } } = await api.get('/google/auth');

      const result = await WebBrowser.openAuthSessionAsync(
        auth_url,
        redirectUrl,
        {
          showTitle: true,
          toolbarColor: theme.colors.primary,
          dismissButtonStyle: 'close',
          preferEphemeralSession: true,
        }
      );

      if (result.type === 'success') {
        await handleUrl({ url: result.url });
      }

    } catch (error) {
      dispatch(setSnackbar({
        visible: true,
        title: 'Erro ao fazer login com Google',
        type: 'error'
      }));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUrl({ url }) {
    try {
      const parsedUrl = new URL(url);

      const error = parsedUrl.searchParams.get('error');
      if (error) {
        dispatch(setSnackbar({
          visible: true,
          title: decodeURIComponent(error),
          type: 'error'
        }));
        return;
      }

      const token = parsedUrl.searchParams.get('token');

      if (token) {
        await signInWithGoogle({ token });
      }

    } catch (error) {
      dispatch(setSnackbar({
        visible: true,
        title: 'Erro ao processar retorno do login',
        type: 'error'
      }));
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require('../../assets/gestab.jpg')}
            resizeMode="contain"
          />
          <Text variant="headlineSmall" style={styles.welcomeText}>
            Bem-vindo de volta! 👋
          </Text>
          <Text variant="bodyLarge" style={styles.subtitleText}>
            Faça login para continuar
          </Text>
        </View>

        <Formik
          initialValues={{ cpf: '032.962.445-81', password: '123' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <Surface style={styles.inputContainer} elevation={0}>
                <InputCpf
                  label="CPF"
                  name="cpf"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  mode="contained"
                  leftColor={theme.colors.primary}
                />
              </Surface>

              <Surface style={styles.inputContainer} elevation={0}>
                <TextInput
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  mode="contained"
                  label="Senha"
                  secureTextEntry={!isPasswordVisible}
                  error={touched.password && Boolean(errors.password)}
                  left={<TextInput.Icon icon="lock" color={theme.colors.primary} />}
                  right={
                    <TextInput.Icon
                      icon={isPasswordVisible ? "eye-off" : "eye"}
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                      color={theme.colors.primary}
                    />
                  }
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </Surface>

              <Button
                mode="text"
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotPassword}
                labelStyle={styles.forgotPasswordText}
              >
                Esqueceu sua senha?
              </Button>

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
                loading={loadingAuth}
                disabled={loadingAuth}
              >
                Entrar
              </Button>
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            <Button
              mode="outlined"
              icon="google"
              onPress={handleGoogleLogin}
              loading={isLoading}
              disabled={isLoading}
              contentStyle={styles.googleButtonContent}
              style={styles.googleButton}
              labelStyle={styles.googleButtonLabel}
            >
              Logar com Google
            </Button>
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Ainda não tem uma conta?
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('SignUp')}
              labelStyle={styles.signUpButtonText}
            >
              Criar conta
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Snackbar />
    </SafeAreaView>
  )
}
