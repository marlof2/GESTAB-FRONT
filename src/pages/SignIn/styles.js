import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../themes/theme.json';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: 24,
    borderRadius: 50,
  },
  welcomeText: {
    color: theme.colors.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitleText: {
    color: '#666',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  input: {
    backgroundColor: 'transparent',
    height: 56,
  },
  inputContent: {
    backgroundColor: 'transparent',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 12,
    height: 56,
  },
  buttonContent: {
    height: 56,
  },
  footer: {
    marginTop: 0,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  socialButtons: {
    width: '100%',
    marginVertical: 16,
  },
  socialButton: {
    backgroundColor: '#F5F5F5',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#666',
  },
  signUpButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  googleButton: {
    borderRadius: 12,
    borderColor: '#E3E3E3',
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  googleButtonLabel: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
});