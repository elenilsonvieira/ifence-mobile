import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
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