import { StyleSheet } from 'react-native';

const alarmStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  itemInfo: {
    color: '#000000',
    fontSize: 20,
    flex: 0.1,
    paddingVertical: 20
  },
  itemList: {
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
  title: {
    color: '#000000',
    fontSize: 28,
    fontWeight: 'bold',
    paddingBottom: 24
  },
});

export default alarmStyles;