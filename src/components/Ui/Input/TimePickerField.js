import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, HelperText, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimePickerField = ({ field, form, label }) => {
    const [show, setShow] = useState(false);
    const [time, setTime] = useState(null);

    const onChange = (event, selectedTime) => {
        setShow(false);
        const currentTime = selectedTime || new Date();
        setTime(currentTime);
        form.setFieldValue(field.name, currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    return (
        <View>
            <TextInput
                style={{ marginBottom: 5, backgroundColor: 'white' }}
                mode="outlined"
                outlineStyle={{ borderRadius: 10 }}
                label={label}
                value={time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                onFocus={() => setShow(true)}
                right={<TextInput.Icon name="clock" />}
            />
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
