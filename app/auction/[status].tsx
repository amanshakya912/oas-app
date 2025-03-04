import { View, Text, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  TabView,
  SceneMap,
  TabBar,
  SceneRendererProps,
} from "react-native-tab-view";
import AuctionList from "@/components/AuctionList";

interface Route {
  key: string;
  title: string;
}

const BrowseAuction = () => {
  const { status } = useLocalSearchParams<{ status: string }>();

  const [routes] = useState<Route[]>([
    { key: "active", title: "Active" },
    { key: "upcoming", title: "Upcoming" },
    { key: "recent", title: "Recent" },
  ]);
  
  const initialIndex = routes.findIndex((route) => route.key === status);
  const [index, setIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

  useEffect(() => {
    if (status) {
      const newIndex = routes.findIndex((route) => route.key === status);
      if (newIndex !== -1) setIndex(newIndex);
    }
  }, [status]);

  const render = ({ route }: SceneRendererProps & { route: Route }) => {
    switch (route.key) {
      case "active":
        return <AuctionList status="active" />;
      case "upcoming":
        return <AuctionList status="upcoming" />;
      case "recent":
        return <AuctionList status="recent" />;
      default:
        return null;
    }
  };
  return (
    <View className="flex-1 bg-black">
      <View className="bg-light-dark h-1/4 rounded-br-[100px] items-center justify-center">
        <Text className="text-white font-lora text-2xl">Browse Auction</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={render}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "white" }}
            style={{
              backgroundColor: "#242628",
              marginTop: 16,
              marginRight: 16,
              marginLeft: 16,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          />
        )}
      />
    </View>
  );
};

export default BrowseAuction;
