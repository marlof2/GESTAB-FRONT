import React, { useContext, useState } from 'react';
import { View, Text, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import styles from './styles';

// import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';

export default function SignUp() {
  // const navigation = useNavigation();
  const { signUp, loadingAuth } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');

  function handleSignUp() {
    if(password == '' || name ==''||email =='' ) return;
    signUp(name, email, password )
  }


  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
        style={styles.container}>


        <View style={styles.areaInput}>
          <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={(name) => { setName(name) }} />
        </View>

        <View style={styles.areaInput}>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={(email) => { setEmail(email) }} />
        </View>

        <View style={styles.areaInput}>
          <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={(password) => { setPassWord(password) }} secureTextEntry={true} />
        </View>

        <TouchableOpacity onPress={handleSignUp} activeOpacity={0.8} style={styles.button} >

          {
            loadingAuth ? (
              <ActivityIndicator size={20} color="#FFF" />
            )
              : (

                <Text style={styles.textButton}>Cadastrar</Text>
              )
          }
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </View>
  )
}
