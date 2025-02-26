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
      const redirectUrl = Linking.createURL('SignIn');
      
      // URL da rota de autenticação do Laravel
      const response = await api.get('/google/auth');
      const authUrl = response.data;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
      
      if (result.type === 'success') {
        const callbackUrl = result.url;
        const code = new URL(callbackUrl).searchParams.get('code');
        
        const response = await api.get(`/google/callback?code=${code}`);
        const data = response.data;
        
        // Primeiro fazemos o login em ambos os casos
        await signInWithGoogle(data);
        
        // Depois verificamos se precisa completar o perfil
        if (data.needsProfileCompletion) {
          navigation.navigate('CompleteProfile');
        }else{
          navigation.navigate('Home');
        }
      }
    } catch (error) {
      console.error('Erro no login com Google:', error);
      dispatch(setSnackbar({ 
        visible: true, 
        title: 'Erro ao fazer login com Google',
        type: 'error' 
      }));
    } finally {
      setIsLoading(false);
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
            <Text style={styles.dividerText}>ou continue com</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            <IconButton
              icon="google"
              mode="contained-tonal"
              size={24}
              onPress={handleGoogleLogin}
              style={styles.socialButton}
              loading={isLoading}
              disabled={isLoading}
            />
            {/* <IconButton
              icon="apple"
              mode="contained-tonal"
              size={24}
              onPress={() => {}}
              style={styles.socialButton}
            />
            <IconButton
              icon="facebook"
              mode="contained-tonal"
              size={24}
              onPress={() => {}}
              style={styles.socialButton}
            /> */}
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
