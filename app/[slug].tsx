import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const ProductDetails = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <View>
      <Text className="text-red-500">ProductDetails {slug}</Text>
    </View>
  );
};

export default ProductDetails;
