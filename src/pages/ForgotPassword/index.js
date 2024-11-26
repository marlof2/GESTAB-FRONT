import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from './styles';
import api from '../../services';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../../store/globalSlice';
import { useNavigation } from '@react-navigation/native';

const stepOneValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
});

const stepTwoValidationSchema = Yup.object().shape({
    token: Yup.string()
        .min(6, 'Token deve ter no mínimo 6 caracteres')
        .required('Token é obrigatório'),
    password: Yup.string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .required('Senha é obrigatória'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Senhas não conferem')
        .required('Confirmação de senha é obrigatória'),
});

function StepIndicator({ currentStep }) {
    const theme = useTheme();
    
    return (
        <Animated.View 
            entering={FadeInDown}
            style={styles.stepIndicatorContainer}
        >
            <View style={styles.stepWrapper}>
                <View style={[
                    styles.stepCircle, 
                    currentStep === 1 && styles.activeStepCircle,
                    currentStep > 1 && styles.completedStepCircle
                ]}>
                    {currentStep > 1 ? (
                        <MaterialIcons name="check" size={20} color="white" />
                    ) : (
                        <Text style={[styles.stepNumber, currentStep === 1 && styles.activeStepNumber]}>1</Text>
                    )}
                </View>
                <Text style={[styles.stepText, currentStep === 1 && styles.activeStepText]}>
                    Enviar Email
                </Text>
            </View>

            <View style={[
                styles.stepLine,
                currentStep > 1 && styles.completedStepLine
            ]} />

            <View style={styles.stepWrapper}>
                <View style={[styles.stepCircle, currentStep === 2 && styles.activeStepCircle]}>
                    <Text style={[styles.stepNumber, currentStep === 2 && styles.activeStepNumber]}>2</Text>
                </View>
                <Text style={[styles.stepText, currentStep === 2 && styles.activeStepText]}>
                    Nova Senha
                </Text>
            </View>
        </Animated.View>
    );
}

export function ForgotPassword() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(1);

    const handleStepOneSubmit = async (values, { setSubmitting }) => {
        try {
            const result = await api.post('/forgot-password', values);
            if (result) {
                if (result.status == 200) {
                    setCurrentStep(2);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStepTwoSubmit = async (values, { setSubmitting }) => {
        try {
            const result = await api.post('/reset-password', values);
            if (result.status == 200) {
                setCurrentStep(2);
                dispatch(setSnackbar({ visible: true, title: 'Senha alterada com sucesso!' }));
                navigation.navigate('SignIn');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image 
                        source={require('../../assets/gestab.jpg')}
                        style={styles.headerImage}
                    />
                    <Text style={styles.subtitle}>Etapa {currentStep} de 2</Text>
                    <StepIndicator currentStep={currentStep} />
                </View>

                <Animated.View 
                    entering={FadeInDown.delay(200)}
                    style={styles.formContainer}
                >
                    {currentStep === 1 ? (
                        <Formik
                            initialValues={{ email: '' }}
                            validationSchema={stepOneValidationSchema}
                            onSubmit={handleStepOneSubmit}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                                <View style={styles.form}>
                                    <Text style={styles.description}>
                                        Digite seu e-mail para receber as instruções de recuperação de senha
                                    </Text>
                                    <TextInput
                                        label="Email"
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        mode="outlined"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        error={touched.email && errors.email}
                                        style={styles.input}
                                        left={<TextInput.Icon icon="email" />}
                                        outlineStyle={{ borderRadius: 10 }}
                                    />
                                    {touched.email && errors.email && (
                                        <Text style={styles.errorText}>{errors.email}</Text>
                                    )}
                                    <Button
                                        mode="contained"
                                        onPress={handleSubmit}
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        style={styles.button}
                                        contentStyle={styles.buttonContent}
                                    >
                                        Enviar Código
                                    </Button>
                                </View>
                            )}
                        </Formik>
                    ) : (
                        <Formik
                            initialValues={{
                                token: '',
                                password: '',
                                confirmPassword: '',
                            }}
                            validationSchema={stepTwoValidationSchema}
                            onSubmit={handleStepTwoSubmit}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                                <View style={styles.form}>
                                    <Text style={styles.description}>
                                        Digite o token recebido no seu e-mail e sua nova senha
                                    </Text>
                                    <TextInput
                                        label="Token"
                                        value={values.token}
                                        onChangeText={handleChange('token')}
                                        onBlur={handleBlur('token')}
                                        mode="outlined"
                                        error={touched.token && errors.token}
                                        style={styles.input}
                                        outlineStyle={{ borderRadius: 10 }}
                                    />
                                    {touched.token && errors.token && (
                                        <Text style={styles.errorText}>{errors.token}</Text>
                                    )}

                                    <TextInput
                                        label="Nova Senha"
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        mode="outlined"
                                        secureTextEntry
                                        error={touched.password && errors.password}
                                        style={styles.input}
                                        outlineStyle={{ borderRadius: 10 }}
                                    />
                                    {touched.password && errors.password && (
                                        <Text style={styles.errorText}>{errors.password}</Text>
                                    )}

                                    <TextInput
                                        label="Confirmar Nova Senha"
                                        value={values.confirmPassword}
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')}
                                        mode="outlined"
                                        secureTextEntry
                                        error={touched.confirmPassword && errors.confirmPassword}
                                        style={styles.input}
                                        outlineStyle={{ borderRadius: 10 }}
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                    )}

                                    <Button
                                        mode="contained"
                                        onPress={handleSubmit}
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        style={styles.button}
                                    >
                                        Redefinir Senha
                                    </Button>
                                </View>
                            )}
                        </Formik>
                    )}
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
} 