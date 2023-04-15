import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, ImageBackground , TextInput} from 'react-native';
import { styles } from './styles/home';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker'

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
            {blobData && 
            <Image source={{uri : blobData}} 
                  style ={{width: Math.min(280, size),
                          height: Math.min(280, size)
                  }}/>}
            </ImageBackground>
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          <Slider style={{width: 200, height: 40}}
                  value={colors}
                  minimumValue={2}
                  maximumValue={15}
                  step={1}
                  onSlidingComplete={value => {
                    setColors(value)
                  }} 
                  trackClickable={true}/>
          <Text>{colors}</Text>
          {/* setting the size of the image to be printed */}
          <View style={styles.printContainer}>
          <TextInput
            style={styles.input}
            // onChangeText={onChangeSize}
            onSubmitEditing={onChangeSize}
            value={size}
            placeholder="Enter image size"
            keyboardType="numeric"
            />
        {/* Print Button */}
        <Button style={styles.button} title="Print"  onPress={print} />
        </View>
        </ImageBackground>
      </View>
    );
  };

  const print = async() => {


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

  useEffect(() => { // payload effect hook
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
      .then((blob) => {
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(blob);
        fileReaderInstance.onload = () => {
          setBlobData(fileReaderInstance.result);
        }
      })
    }
  }, [image])
  
  return (
    <View style={styles.container}>
      <BackgroundImg/>
    </View>
  );
}

