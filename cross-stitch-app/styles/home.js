import { StyleSheet , Dimensions} from 'react-native';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },

    backImage: {
      height: screenHeight,
      width: screenWidth,
      justifyContent: 'center',
      alignItems: 'center',
    },

    input: {
      height: 40,
      width: 160,
      margin: 12,
      borderWidth: 2,
      borderColor: 'cornflowerblue',
      padding: 10,
    },

    printContainer: {
      flexDirection: 'row',
      height: 50, 
      alignItems: 'center',
      justifyContent: 'center',
    },

    button: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    sliderText:
    {
      textsize: 14,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: -5
    },

    sliderNumber: 
    {
      textsize: 20,
      textAlign: 'center',
      marginTop: -10,
      marginBottom:10
      

    }
});

export { styles }
  
