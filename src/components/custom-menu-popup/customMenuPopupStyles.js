import { StyleSheet } from 'react-native';

const customMenuStyles = StyleSheet.create({
  menu: {
    margin: 16,
    alignItems: "flex-end",
    width: '90%',
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

export default customMenuStyles;