import { StyleSheet } from 'react-native';

const braceletsStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    paddingTop: 22,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    color: '#000000',
    fontSize: 28,
    fontWeight: 'bold',
    paddingBottom: 24
  },
  register: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#000000",
    fontSize: 20,
    margin: 10,
  },
  input: {
    color: '#000000',
    width: "100%",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 20,
  },
  body: {
    display: 'flex',
    flex: 3,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: '#E9E9E9'
  },
  header: {
    backgroundColor: "#00ff00",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  item: {
    height: 150,
    width: '50%',
    display: 'flex',
    flex: 1,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: '#0554F2',
    justifyContent: 'flex-end',
  },
  text_header: {
    color: "#000000",
    fontSize: 35,
    fontStyle: "italic",
    margin: 10,
  },
  text_item: {
    color: '#FAFBFD',
    fontSize: 32,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    margin: 20,
  },
  button: {
    color: '#000000',
    width: 150,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#00ff00",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  deleteButton: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#037272",
    padding: 10,
    borderRadius: 8,
  },

  formContent: {
    width: '80%',
    display: 'flex',
    flex: 1,
    paddingTop: 22,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  itemContent: {
    maxWidth: '50%',
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1
  }
});

export default braceletsStyles;