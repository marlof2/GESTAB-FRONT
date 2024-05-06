import React, { useState, useContext } from 'react';
import { View, Text, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import styles from './styles';

import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';




export default function SignIn() {
  const navigation = useNavigation();
  const { signIn, loadingAuth } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validate, setValidate] = useState(false);

  function handleLogin() {
    if (email === '' || password === '') {
      setValidate(true)
      return false;
    }
    setValidate(false)

    signIn(email, password)
  }

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
        style={styles.container}>

        <Image style={styles.logo} source={require('../../assets/logo1.png')} />

        <View style={styles.areaInput}>
          <TextInput
            style={[styles.input, validate ? {borderColor:'red'}: '#222']}
            placeholder={ validate ? 'Email é obrigatório' : 'Email'}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.areaInput}>
          <TextInput
             style={[styles.input, validate ? {borderColor:'red'}: '#222']}
            placeholder={ validate ? 'Senha é obrigatório' : 'Senha'}
            value={password}
            onChangeText={(text) => setPassword(text)} />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={handleLogin}
        >
          {
            loadingAuth ? (
              <ActivityIndicator size={20} color="#FFF" />
            ) : (
              <Text style={styles.textButton}>Entrar</Text>
            )
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.link}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.textLink}>Criar conta</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </View>
  )
}
