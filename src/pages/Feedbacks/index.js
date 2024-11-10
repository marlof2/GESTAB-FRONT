import React, { useEffect, useState, useContext } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Button, TextInput, Text, Card } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Overlay from '../../components/Ui/Overlay';
import api from '../../services';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../../store/globalSlice';
import Header from '../../components/Header';
import { AuthContext } from '../../contexts/auth';
import Snackbar from '../../components/Ui/Snackbar';
import Dropdown from '../../components/Ui/Input/DropdownFormik';

export default function Form() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [ItemCategories, setItemsCategories] = useState([]);
  const { user } = useContext(AuthContext);
  const dataUser = user.user;


  const getCategories = async () => {
    const response = await api.get(`/categories`, { params: { limit: '-1' } });

    if (response.status == 200) {
      setItemsCategories(response.data.data);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const validationSchema = Yup.object().shape({
    category_id: Yup.string().required('Campo obrigatório'),
    title: Yup.string().required('Campo obrigatório'),
    description: Yup.string().required('Campo obrigatório'),
  });

  async function saveForm(obj) {
    obj.user_id = dataUser.id;
    setLoading(true);
    try {
      const { status } = await api.post('/feedbacks', obj);

      if (status == 201) {
        setLoading(false);
        dispatch(setSnackbar({ visible: true, title: 'Realizado com sucesso!' }));
      }
    } catch (error) {
      console.log('Erro ao adicionar um feedback', error);
      setLoading(false);
    }
  }

  return (
    <View>
      <Overlay isVisible={loading} />
      <Header title={'Fale Conosco'} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>
        <Card style={styles.card}>
          <Card.Title title={'Criar Feedback'} titleStyle={styles.titleCard} />
          <Card.Content>
            <Formik
              initialValues={{ category_id: '', title: '', description: '' }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                saveForm(values);
                resetForm();
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                errors,
                touched,
              }) => {
                return (
                  <View>
                    <Dropdown
                      label="Categoria"
                      data={ItemCategories}
                      placeholder="Selecione a categoria"
                      value={values.category_id}
                      onChange={(value) => setFieldValue('category_id', value)}
                      labelField="name"
                      valueField="id"
                    />

                    {touched.category_id && errors.category_id && (
                      <Text style={styles.errorText}>{errors.category_id}</Text>
                    )}

                    <TextInput
                      outlineStyle={{ borderRadius: 10 }}
                      style={styles.input}
                      onChangeText={handleChange('title')}
                      onBlur={handleBlur('title')}
                      value={values.title}
                      mode="outlined"
                      label="Título"
                      dense
                      error={touched.title && Boolean(errors.title)}
                      maxLength={100}  // Limita a quantidade de caracteres
                    />
                    {touched.title && errors.title && (
                      <Text style={styles.errorText}>{errors.title}</Text>
                    )}

                    {
                      values.title.length > 0 ?
                        <Text style={styles.characterCount}>
                          {values.title.length}/{500}
                        </Text>
                        : null
                    }

                    <TextInput
                      outlineStyle={{ borderRadius: 10 }}
                      style={styles.input}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      value={values.description}
                      mode="outlined"
                      label="Descrição"
                      multiline
                      numberOfLines={4}
                      dense
                      error={touched.description && Boolean(errors.description)}
                      maxLength={500}  // Limita a quantidade de caracteres
                    />
                    {touched.description && errors.description && (
                      <Text style={styles.errorText}>{errors.description}</Text>
                    )}

                    {
                      values.description.length > 0 ?
                        <Text style={styles.characterCount}>
                          {values.description.length}/{500}
                        </Text>
                        : null
                    }


                    <Button
                      style={styles.button}
                      mode="contained"
                      icon="content-save"
                      onPress={handleSubmit}
                    >
                      Salvar
                    </Button>
                  </View>
                );
              }}
            </Formik>
          </Card.Content>
        </Card>
        <Snackbar />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  titleCard: {
    fontSize: 23,
    fontWeight: 'bold',
    padding: 10,
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  button: {
    marginTop: 10,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 5,
  },
  characterCount: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: 'gray',
  },
});
