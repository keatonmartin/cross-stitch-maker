import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, ImageBackground , TextInput} from 'react-native';
import { styles } from './styles/home';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import * as Sharing from 'expo-sharing';

const ENDPOINT = 'https://us-central1-credible-rider-383823.cloudfunctions.net/ml'

export default function App() {
  const [image, setImage] = useState(null) // image hook 
  const [blobData, setBlobData] = useState(null)
  const [colors, setColors] = useState(2) 
  const [size, setSize] = useState(40)

  const BackgroundImg = () => {
    const currentImage = require('./assets/Greedent.png')
    return (
      <View>
        <ImageBackground
          source={
          require("./assets/back.png")
          }
          resizeMode="stretch"
          style={styles.backImage}>
            <ImageBackground source={require("./assets/board.png")} 
                    style={{ width: 300, 
                            height: 300,
                            marginBottom: 20,
                            marginTop: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
            }}>
            {image && 
            <Image source={{uri : image.uri}} 
                  style ={{width: 280,
                          height: 280
                  }}/>}
            </ImageBackground>
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          <Text style={styles.sliderText}> Number of Colors</Text>
          <Slider style={{width: 200, height: 40}}
                  value={colors}
                  minimumValue={2}
                  maximumValue={15}
                  step={1}
                  onSlidingComplete={value => {
                    setColors(value)
                  }} 
                  trackClickable={true}/>
          <Text style={styles.sliderNumber}>{colors}</Text>
          {/* setting the size of the image to be printed */}
          <View style={styles.printContainer}>
          <TextInput
            style={styles.input}  
            onSubmitEditing={setSize}
            value={size}
            placeholder="Enter image size"
            keyboardType="numeric"
            />
        {/* Print Button */}
        <Button style={styles.button} title="Download"  onPress={print} />
        </View>
        </ImageBackground>
      </View>
    );
  };

  const print = async() => {
    if (image) { // if image has been loaded, send payload
      var photo = { 
        uri: image.uri,
        type: "image/png",
        name: "photo.png",
      }
      var body = new FormData();
      body.append('colors', colors);
      body.append('image', photo);
      fetch(ENDPOINT + `?colors=${colors}&size=${size}`, {
        method: "POST",
        body
      }).then(res => res.blob())
      .then(blob => {
        const fr = new FileReader();
        fr.onload = async() => {
          // console.log(fr.result);
          const fileUri = `${FileSystem.documentDirectory}/image.png`;
          await FileSystem.writeAsStringAsync(fileUri, fr.result.split(',')[1], { encoding: FileSystem.EncodingType.Base64 });
          Sharing.shareAsync(fileUri);
        }
        fr.readAsDataURL(blob);
      })
    }
  }

  const pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  }

  return (
    <View style={styles.container}>
      <BackgroundImg/>
    </View>
  );
}

