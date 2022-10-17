import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
  formContent: {
    width: '80%',
    display: 'flex',
    flex: 1,
    paddingTop: 22,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});



export default styles;