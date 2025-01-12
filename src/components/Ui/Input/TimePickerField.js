import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimePickerField = ({ field, form, label }) => {
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(null);

  const onChange = (event, selectedTime) => {
    setShow(false);
    if (event.type === 'dismissed') {
      return;
    }
    if (selectedTime) {
      const currentTime = selectedTime || new Date();
      setTime(currentTime);
      form.setFieldValue(
        field.name,
        currentTime.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      );
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)}>
        <TextInput
          style={{ marginBottom: 5, backgroundColor: 'white' }}
          mode="outlined"
          outlineStyle={{ borderRadius: 10 }}
          label={label}
          value={
            time
              ? time.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })
              : ''
          }
          editable={false}
          right={
            <TextInput.Icon
              name={time ? 'close' : 'clock'}
              onPress={() => {
                if (time) {
                  setTime(null);
                  form.setFieldValue(field.name, '');
                } else {
                  setShow(true);
                }
              }}
            />
          }
        />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={time || new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      {form.touched[field.name] && form.errors[field.name] && (
        <Text style={{ color: 'red', marginLeft: 20, marginBottom: 8 }}>
          {form.errors[field.name]}
        </Text>
      )}
    </View>
  );
};

export default TimePickerField;