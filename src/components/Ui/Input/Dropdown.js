import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

const DropdownSimple = ({
  label,
  data,
  placeholder,
  value,
  onChange,
  labelField,
  valueField,
  searchPlaceholder = "Pesquisar...",
  disable = false,
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
        disable={disable}
        style={[
          styles.dropdown,
          isFocus && { borderColor: 'rgb(0, 104, 116)' },
          disable && styles.disabledDropdown,
        ]}
        placeholderStyle={[
          styles.placeholderStyle,
          disable && styles.disabledText,
        ]}
        selectedTextStyle={[
          styles.selectedTextStyle,
          disable && styles.disabledText,
        ]}
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
          if (item) {
            onChange(item);
            setIsFocus(false);
          }
        }}
        renderRightIcon={() => {
          if (disable) return null;
          
          return value ? (
            <IconButton
              icon="close"
              size={20}
              onPress={() => onChange(null)}
            />
          ) : (
            <IconButton icon="menu-down" size={20} disabled={true} />
          );
        }}
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
  disabledDropdown: {
    backgroundColor: '#f0f0f0',
    borderColor: '#d3d3d3',
    opacity: 0.7,
  },
  disabledText: {
    color: '#999',
  },
});

export default DropdownSimple;