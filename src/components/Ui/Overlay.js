import { View, StyleSheet } from 'react-native';
import { Modal, ActivityIndicator, Portal } from 'react-native-paper';

const Overlay = ({ isVisible }) => {
  return (
    <Portal>
      <Modal visible={isVisible} dismissable={!isVisible} transparent>
        <View style={styles.overlay}>
          <ActivityIndicator animating={true} size='large' />
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparência leve
  }
});

export default Overlay;
