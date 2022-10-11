import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    color: '#000000',
    fontSize: 35,
    margin: 5,
  },
  alarmSeen: {
    fontStyle: 'normal'
  },
  alarmNotSeen: {
    fontWeight: '600' 
  },
});

export default styles;