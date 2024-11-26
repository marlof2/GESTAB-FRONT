import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    paddingVertical: 24,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  formContainer: {
    gap: 16,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  segmentedButton: {
    marginBottom: 8,
  },
  inputGroup: {
    gap: 12,
  },
  input: {
    backgroundColor: '#fff',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  submitButton: {
    borderRadius: 8,
    height: 48,
  },
  backButton: {
    borderRadius: 8,
    height: 48,
  },
  buttonContent: {
    height: 48,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: 4,
  },
});