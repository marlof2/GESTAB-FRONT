import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "../src/routes";
import AuthProvider from "../src/contexts/auth";
import { StatusBar } from "react-native";
import 'react-native-gesture-handler';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import store from '../src/store';
import { Provider as StoreProvider } from 'react-redux';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3b3dbf',
    secondary: '#5B7BD0',
  },
};

// import { useDispatch } from 'react-redux';
// import { setMessagesError } from '../store';
// import { useSelector } from 'react-redux';

// const dispatch = useDispatch();

// dispatch(setMessagesError('Unauthenticated'));
// const message = useSelector(state => state.message);
// console.log(message)

export default function App() {
  return (
    <StoreProvider store={store}>
      <NavigationContainer independent={true}>
        <AuthProvider>
          <PaperProvider theme={theme}>
            {/* <StatusBar backgroundColor="#2D4EB2" barStyle='light-content' /> */}
            <Routes />
          </PaperProvider>
        </AuthProvider>
      </NavigationContainer>
    </StoreProvider>
  );
}