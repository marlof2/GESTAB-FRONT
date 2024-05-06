import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";
import AuthProvider from "./src/contexts/auth";
import { StatusBar } from "react-native";
import 'react-native-gesture-handler';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import themeCustom from './src/themes'

const themeDefault = 'ligth'
const themeSelected = () => {
  if (themeDefault == 'ligth') {
    return themeCustom.light.colors
  } else {
    return themeCustom.dark.colors
  }
}

const theme = {
  ...DefaultTheme,
  colors: themeSelected(),
};

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <StatusBar backgroundColor={themeDefault == 'ligth' ? "#376BA6" : ''} barStyle={themeDefault == 'ligth' ? 'light-content' : 'dark-content'} />
          <Routes />
        </PaperProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}