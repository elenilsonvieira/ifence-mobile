import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
  text: {
    color: "#000000",
    fontSize: 20,
    margin: 10,
  },
  text_item: {
    color: "#000000",
    fontSize: 35,
    margin: 5,
  },
  button: {
    width: 150,
    height: 50,
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
});

export default styles;