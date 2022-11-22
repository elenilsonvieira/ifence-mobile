import { StyleSheet } from 'react-native';

const searchBarStyles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 40,
    flexDirection: "row",
    alignItems:'center'
  },
  input: {
    display: 'flex',
    flex: 1,
    padding: 10,
    paddingLeft: 20
  },
  searchIcon: {
    paddingRight: 12,
  },
});

export default searchBarStyles;