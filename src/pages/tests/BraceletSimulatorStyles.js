import { StyleSheet } from 'react-native';

const BraceletSimulatorStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  options: {
    flex: 1,
    paddingTop: 22,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    color: "#000000",
    fontSize: 20,
    margin: 10,
  },
  coordinatesContainer: {
    margin: 20,
  },
  button: {
    marginBottom: 10, 
    margin: 50, 
    padding: 10, 
    borderRadius: 10, 
    width: "40%",
    backgroundColor: "#00ff00",
    alignItems: "center",
    justifyContent: "center",
  },
  space: {
    width: 20,
    height: 20,
  },
});

export default BraceletSimulatorStyles;