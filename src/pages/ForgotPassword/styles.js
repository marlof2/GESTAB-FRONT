import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  stepWrapper: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activeStepCircle: {
    backgroundColor: 'rgb(0, 103, 131)',
  },
  completedStepCircle: {
    backgroundColor: '#4CAF50',
  },
  stepNumber: {
    color: '#666',
    fontSize: 16,
  },
  activeStepNumber: {
    color: '#fff',
  },
  stepText: {
    color: '#666',
    fontSize: 14,
  },
  activeStepText: {
    color: 'rgb(0, 103, 131)',
    fontWeight: 'bold',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 10,
  },
  completedStepLine: {
    backgroundColor: '#4CAF50',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  form: {
    gap: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: -5,
    marginLeft: 5,
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
}); 