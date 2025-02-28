import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Api from "@/utils/Api";
import { Product } from "@/types";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import Helper from "@/utils/Helper";
import { useSharedValue } from "react-native-reanimated";
import { Link } from "expo-router";
import CountdownTimer from "./CountdownTimer";

const CurrentAuctions = () => {
  const progress = useSharedValue<number>(0);

  const screenWidth = Dimensions.get("window").width;
  console.log("scre", screenWidth);
  const [products, setProducts] = useState<Product[]>([]);
  const handleCountdownComplete = () => {
    console.log("compete");
  };
  useEffect(() => {
    const getProductData = async () => {
      try {
        const res = await Api.getProducts();
        const currentTime = new Date();
        const liveProducts = res.filter((product: Product) => {
          const endTime = new Date(product.auctionEndTime);
          const startTime = new Date(product.auctionStartTime);
          return (
            currentTime < endTime &&
            currentTime >= startTime &&
            product.status !== "Sold"
          );
        });
        // console.log(liveProducts);
        setProducts(liveProducts);
      } catch (e) {
        console.log("Error fetching products:", e);
      }
    };
    getProductData();
  }, []);
  return (
    <View className="px-4">
      <View className="flex-1">
        {products.length > 0 ? (
          <>
            <Carousel
              loop={true}
              width={screenWidth - 30}
              height={480}
              snapEnabled={true}
              pagingEnabled={true}
              data={products}
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
              mode={"horizontal-stack"}
              modeConfig={{
                snapDirection: "left",
                stackInterval: 18,
              }}
              customConfig={() => ({ type: "positive", viewCount: 5 })}
              renderItem={({ item }) => (
                <>
                  <Link
                    href={{
                      pathname: "/[slug]",
                      params: {
                        slug: item.slug ? item.slug : "",
                      },
                    }}
                  >
                    <View
                      className="bg-brown border-0 rounded-2xl overflow-hidden group h-full w-full items-center"
                      key={item._id}
                    >
                      {item?.images?.length > 0 && (
                        <Image
                          source={{ uri: Helper.BASE_URL + item.images[0] }}
                          style={{
                            width: "80%",
                            height: "80%",
                          }}
                          className="flex-1"
                        />
                      )}
                      <View className="absolute bottom-0">
                        <View>
                          <View className="bg-light-dark ml-5 p-2 mb-5 rounded-3xl flex-row items-center justify-center gap-5 w-1/2">
                            <CountdownTimer
                              countdownDate={
                                new Date(item.auctionEndTime)
                              }
                              onComplete={handleCountdownComplete}
                            />
                          </View>
                        </View>
                        <View className="bg-light-dark w-full px-5 py-3 flex-row justify-between items-center">
                          <View>
                            <Text className="text-white">{item.name}</Text>
                            <Text className="text-white">
                              Current Bid: Rs. {item.currentBid}
                            </Text>
                          </View>
                          <View>
                            <Text className="text-white">
                              No. of Bids: {item.activeBidders?.length}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Link>
                </>
              )}
            />
          </>
        ) : (
          <>
            <Text className="text-white text-xl text-center py-8">
              None of the Auctions are currently active
            </Text>
            <View className="py-4">
              <ActivityIndicator size="large" color="#A27B5C" />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default CurrentAuctions;
