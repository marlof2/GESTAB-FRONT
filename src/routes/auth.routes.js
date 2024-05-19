import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import theme from '../themes/theme.json';
import string from '../strings';

const AuthStack = createNativeStackNavigator();

function AuthRoutes(){
  return(
    <AuthStack.Navigator>
      <AuthStack.Screen 
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerStyle: {
            backgroundColor: '#2D4EB2',
          },
          headerTintColor: '#fff',
          headerTitle: string.btnVoltar,
          headerBackTitleVisible: false
        }}
      />
    </AuthStack.Navigator>
  )
}

export default AuthRoutes;