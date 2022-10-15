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
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 10,
    shadowColor: '#00213B',
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 10,
    },
    backgroundColor: '#00213B'
  },
});

export default styles;