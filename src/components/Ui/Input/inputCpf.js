import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useField } from 'formik';

const Input = ({ label, mode = 'outlined', leftColor = 'black', ...props }) => {
    const [field, meta, helpers] = useField(props.name);

    const handleChange = (text) => {
        const maskedText = applyMask(text);
        helpers.setValue(maskedText);
    };

    // Função para aplicar a máscara de CPF
    const applyMask = (text) => {
        let cleaned = ('' + text).replace(/\D/g, ''); // Remove qualquer caractere não numérico
        let match = cleaned.match(/^(\d{1,3})(\d{1,3})?(\d{1,3})?(\d{1,2})?$/);

        if (match) {
            return `${match[1]}${match[2] ? '.' + match[2] : ''}${match[3] ? '.' + match[3] : ''}${match[4] ? '-' + match[4] : ''}`;
        }

        return text;
    };


    return (
        <View>
            <TextInput
                outlineStyle={{ borderRadius: 10 }}
                style={styles.input}
                mode={mode}
                label={label}
                value={field.value}
                onChangeText={handleChange}
                onBlur={() => helpers.setTouched(true)}
                dense
                error={meta.touched && Boolean(meta.error)}
                left={<TextInput.Icon icon="card-account-details-outline" color={leftColor} />}
                maxLength={14}
                keyboardType='numeric'
            />
            {meta.touched && meta.error && <Text style={styles.errorText}>{meta.error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 5,
        backgroundColor: 'transparent',
    },
    errorText: {
        color: '#B00020',
        fontSize: 12,
        marginTop: 4,
    },
});

export default Input;