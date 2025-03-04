import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

const Loader = () => {
  return (
    <View className="py-4">
      <ActivityIndicator size="large" color="#A27B5C" />
    </View>
  );
};

export default Loader;
