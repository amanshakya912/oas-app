import { Stack } from "expo-router";
import '../global.css';
import * as Font from 'expo-font';
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { View } from "react-native";
import Header from "@/components/Header";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Lora': require('../assets/fonts/Lora-Regular.ttf'),
        'Lora-Bold': require('../assets/fonts/Lora-Bold.ttf'),
        'Lora-Medium': require('../assets/fonts/Lora-Medium.ttf'),
        'Lora-SemiBold': require('../assets/fonts/Lora-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <>
      <View className="flex-1">
        <Header/>
          <Stack screenOptions={{headerShown: false}}> 
            <Stack.Screen name="index"/>
            <Stack.Screen name="signup"/>
            <Stack.Screen name="signin"/>
          </Stack>
        <Footer/>
      </View>
    </>
);
}
