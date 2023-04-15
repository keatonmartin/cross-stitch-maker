import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, ImageBackground } from 'react-native';
import { styles } from './styles/home';
import * as ImagePicker from 'expo-image-picker'


export default function App() {
  const [image, setImage] = useState(null) // image hook 

  const BackgroundImg = () => {
  return (
    <View>
      <ImageBackground
        source={
         require("./assets/back.png")
        }
        resizeMode="stretch"
        style={styles.image}>
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

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }


  return (
    <View style={styles.container}>
      <BackgroundImg/>
    </View>
  );
}

