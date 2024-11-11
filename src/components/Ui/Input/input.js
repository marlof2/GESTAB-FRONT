import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useField } from 'formik';

const Input = ({ label, ...props }) => {
    const [field, meta, helpers] = useField(props.name);


    return (
        <View>
            <View style={styles.areaInput}>
                <TextInput
                    outlineStyle={{ borderRadius: 10 }}
                    style={styles.input}
                    mode="outlined"
                    label={label}
                    value={field.value}
                    onChangeText={text => helpers.setValue(text)}
                    onBlur={() => helpers.setTouched(true)}
                    dense
                    error={meta.touched && Boolean(meta.error)}
                />
            </View>
            {meta.touched && meta.error && <Text style={styles.errorText}>{meta.error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    areaInput: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    input: {
        width: '95%',
        marginBottom: 5,
    },
    errorText: {
        color: 'red',
        marginLeft: 20,
        marginBottom:8
    },
});

export default Input;