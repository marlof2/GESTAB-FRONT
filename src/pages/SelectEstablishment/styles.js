import { StyleSheet } from 'react-native';
import theme from '../../themes/theme.json';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: theme.colors.secondary,
  },
  dropdown: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
}); 