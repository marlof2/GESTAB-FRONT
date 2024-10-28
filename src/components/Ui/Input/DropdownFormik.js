import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

const DropdownFormik = ({ 
  label, 
  data, 
  placeholder, 
  value, 
  onChange, 
  labelField, 
  valueField, 
  searchPlaceholder = "Pesquisar..." 
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (isFocus || value) {
      return (
        <Text style={[styles.label, isFocus && { color: 'rgb(0, 104, 116)' }]}>
          {label}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.containerDropdown}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'rgb(0, 104, 116)' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={data}
        search
        maxHeight={300}
        labelField={labelField}
        valueField={valueField}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item[valueField]);  // Passa o valor selecionado de volta
          setIsFocus(false);
        }}
        renderRightIcon={() =>
          value ? (
            <IconButton
              icon="close"
              size={20}
              onPress={() => onChange('')}  // Limpa o valor quando o botão de fechar for pressionado
            />
          ) : (
            <IconButton icon="menu-down" size={25} disabled={true} />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerDropdown: {
    marginBottom: 25,
  },
  dropdown: {
    height: 43,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
    top: 15,
    backgroundColor: 'white',
  },
  label: {
    position: 'absolute',
    backgroundColor: 'transparent',
    left: 8,
    top: -4,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 15,
  },
});

export default DropdownFormik;
