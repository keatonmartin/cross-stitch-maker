import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, ImageBackground } from 'react-native';
import { styles } from './styles/home';
import * as ImagePicker from 'expo-image-picker'

const ENDPOINT = 'https://us-central1-credible-rider-383823.cloudfunctions.net/ml'

export default function App() {
  const [image, setImage] = useState(null) // image hook 
  const [blobData, setBlobData] = useState(null)
  const [colors, setColors] = useState(2) // default colors

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
                  style ={{width: 280,
                          height: 280
                  }}/>}
            </ImageBackground>
            

          <Button title="Pick an image from camera roll" onPress={pickImage} />
        </ImageBackground>
      </View>
    );
  };
  const pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      aspect: [4, 3],
      // quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  }

  useEffect(() => { // payload effect hook
    if (image) { // if image has been loaded, send payload
      var photo = { 
        uri: image.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      }
      var body = new FormData();
      body.append('colors', colors);
      body.append('image', photo);
      fetch(ENDPOINT + `?colors=${colors}`, {
        method: "POST",
        body
      }).then(res => res.blob())
      .then((blob) => {
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(blob);
        fileReaderInstance.onload = () => {
          base64data = fileReaderInstance.result;
          // console.log(base64data);
          setBlobData(base64data);
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

