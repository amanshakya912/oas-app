import Banner from "@/components/Banner";
import CurrentAuctions from "@/components/CurrentAuctions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RecentAuctions from "@/components/RecentAuctions";
import UpcomingAuctions from "@/components/UpcomingAuctions";
import { Text, View, Image, ScrollView } from "react-native";
// import { Image } from 'expo-image';

export default function Index() {
  return (
    <View className="bg-black">
      <ScrollView>
        <Banner/>
        <Text className="text-white font-lora text-2xl text-center pt-4 pb-8">
          Current Auctions
        </Text>
        <CurrentAuctions />
        <Text className="text-white font-lora text-2xl text-center">
          Upcoming Auctions
        </Text>
        <UpcomingAuctions />
        <Text className="text-white font-lora text-2xl text-center">
          Recent Auctions
        </Text>
        <RecentAuctions />
      </ScrollView>
    </View>
  );
}
