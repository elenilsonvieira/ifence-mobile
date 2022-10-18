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
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  header: {
    backgroundColor: "#00ff00",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  item: {
    flex: 3,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text_header: {
    color: "#000000",
    fontSize: 35,
    fontStyle: "italic",
    margin: 10,
  },
  text_item: {
    color: "#000000",
    fontSize: 35,
    margin: 5,
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
});

export default braceletsStyles;