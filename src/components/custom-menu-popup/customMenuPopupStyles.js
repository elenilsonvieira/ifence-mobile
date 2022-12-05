import { StyleSheet, Dimensions } from 'react-native';

const deviceHeight = Dimensions.get('window').height;

const customMenuStyles = StyleSheet.create({
  popup: {
    width: '100%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 10,
    maxHeight: deviceHeight * 0.5,
    justifyContent: 'flex-end',
    backgroundColor: '#FAFBFD'
  },
  view: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#000000AA'
  },
  title: {
    alignItems: 'center'
  },
  fontTitle: {
    color: '#6D6D6D',
    fontSize: 25,
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 30
  },
  item: {
    flexDirection: 'row',
    height: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 7
  },
  textItem: {
    fontSize: 18,
    color: '#6D6D6D',
  }
});

export default customMenuStyles;