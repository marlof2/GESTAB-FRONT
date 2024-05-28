import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "../src/routes";
import AuthProvider from "../src/contexts/auth";
import { StatusBar } from "react-native";
import 'react-native-gesture-handler';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import {store} from '../src/store';
import { Provider as StoreProvider } from 'react-redux';
import theme from '../src/themes/theme.json'



export default function App() {
  return (
    <StoreProvider store={store}>
      <NavigationContainer independent={true}>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <StatusBar backgroundColor={theme.colors.primary} barStyle='light-content' />
            <Routes />
          </AuthProvider>
        </PaperProvider>
      </NavigationContainer>
    </StoreProvider>
  );
}