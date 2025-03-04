import { View, Text, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import banner1 from "../assets/images/banner1.jpg";
import { LinearGradient } from "expo-linear-gradient/build/LinearGradient";

const Banner = () => {
  return (
    <View className="mb-4">
      <Image source={banner1} style={{ width: 400, height: 400 }} />
      <View className="absolute inset-0">
        <LinearGradient
          colors={["black", "transparent", "black"]}
          locations={[0, 0.5, 1]}
          className="w-full h-full"
        />
      </View>
      {/* <View className="absolute bottom-[18%] left-[15%]">
        <View className="flex flex-row gap-10">
          <Pressable className="bg-brown rounded-md px-8 py-3">
            <Text className="text-white text-xl">Bid Now</Text>
          </Pressable>
          <Pressable className="bg-brown rounded-md px-8 py-3">
            <Text className="text-white text-xl">Sell Now</Text>
          </Pressable>
        </View>
      </View> */}
    </View>
  );
};

export default Banner;
