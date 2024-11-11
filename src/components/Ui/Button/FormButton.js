import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const FormButton = ({ icon, mode, onPress, title }) => {
  return (
    <View style={styles.areaBtn}>
      <Button
        icon={icon}
        mode={mode}
        onPress={onPress}
        style={styles.button}
      >
        {title}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  areaBtn:{
    justifyContent:'center',
    alignItems:'center'
  },
  button: {
    width: '95%',
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default FormButton;