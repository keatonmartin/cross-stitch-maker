import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image } from 'react-native';
import { styles } from './styles/home';
import * as ImagePicker from 'expo-image-picker'

const ENDPOINT = 'https://us-central1-credible-rider-383823.cloudfunctions.net/ml'

export default function App() {
  const [image, setImage] = useState(null) // image hook 
  const [blobData, setBlobData] = useState(null)

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
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {blobData && <Image source={{ uri: blobData }} style={{ width: 200, height: 200 }} />}
    </View>

  );
}

