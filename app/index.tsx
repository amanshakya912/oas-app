import CurrentAuctions from "@/components/CurrentAuctions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Text, View, Image, ScrollView } from "react-native";
// import { Image } from 'expo-image';

export default function Index() {
  return (
    <View className="bg-black">
        <ScrollView>
          <CurrentAuctions/>
        </ScrollView>
    </View>
  );
}
