import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import string from '../strings';

import { Appbar } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';

const AuthStack = createNativeStackNavigator();

function AuthRoutes() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        header: (props) => <CustomNavigationBar {...props} />
      }}>
      <AuthStack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen

        name="SignUp"
        component={SignUp}
        options={{
          headerTitle: string.btnVoltar,
        }}
      />
    </AuthStack.Navigator>
  )
}

export default AuthRoutes;


function CustomNavigationBar({navigation, route, options, back }) {
  const title = getHeaderTitle(options, route.name);
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}