import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, ImageBackground } from 'react-native';
import { styles } from './styles/home';
import * as ImagePicker from 'expo-image-picker'

const ENDPOINT = 'https://us-central1-credible-rider-383823.cloudfunctions.net/ml'

export default function App() {
  const [image, setImage] = useState(null) // image hook 
  const [blobData, setBlobData] = useState(null)

  const BackgroundImg = () => {
    const currentImage = require('./assets/Greedent.png')
    return (
      <View>
        {/* displaying background */}
        <ImageBackground
          source={
          require("./assets/back.png")
          }
          resizeMode="stretch"
          style={styles.backImage}>
            {/* displaying box frame for image */}
            <ImageBackground source={require("./assets/board.png")} 
                    style={{ width: 300, 
                            height: 300,
                            marginBottom: 20,
                            marginTop: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
            }}>
            {/* displaying image selected or logo */}
            <Image source={currentImage} 
                  style ={{width: 100,
                          height: 100,
                          margin: 10
                  }}/>
            </ImageBackground>
            

          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
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
      body.append('image', photo);
      fetch(ENDPOINT, {
        method: "POST",
        body
      }).then(res => res.blob())
      .then((blob) => {
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(blob);
        fileReaderInstance.onload = () => {
          base64data = fileReaderInstance.result;
          setBlobData(base64data)
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

