import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    right: 70
  },
  button: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 10,
    shadowColor: '#9305F2',
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 10,
    },
    backgroundColor: '#9305F2'
  },
});

export default styles;