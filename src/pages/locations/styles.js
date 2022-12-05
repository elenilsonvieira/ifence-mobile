import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 3,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: '#E9E9E9'
  },
  listWrapper: {
    flexDirection: "row",
    flexWrap: 'wrap',
    borderBottomWidth: .5
  },
  row: {
    color: '#000000',
    fontSize: 20,
    flex: 1,
    paddingHorizontal: 2,
    paddingVertical: 8
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
});

export default styles;