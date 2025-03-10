import { View, Text, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Api from "@/utils/Api";
import { Product } from "@/types";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import Helper from "@/utils/Helper";
import { useSharedValue } from "react-native-reanimated";
import { Link } from "expo-router";
import Loader from "./Loader";

const RecentAuctions = () => {
  const [loading, setLoading] = useState(false);
  const progress = useSharedValue<number>(0);

  const screenWidth = Dimensions.get("window").width;
  // console.log("scre", screenWidth);
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const getProductData = async () => {
      try {
        setLoading(true);
        const res = await Api.getProducts(); // Fetch product data from API
        const currentTime = new Date();

        const recentProducts = res.filter((product: Product) => {
          const startTime = new Date(product.auctionStartTime);
          const endTime = new Date(product.auctionEndTime);
          return (
            currentTime > endTime ||
            ["Sold", "Withdrawn"].includes(product.status ? product.status : "")
          );
        });

        // console.log('Recent Products:', res);
        setProducts(recentProducts);
        setLoading(false);
      } catch (e) {
        console.log("Error fetching products:", e);
      }
    };
    getProductData();
  }, []);
  return (
    <View className="px-4">
      <View className="flex-1">
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            {products.length > 0 ? (
              <>
                <Carousel
                  loop={true}
                  width={screenWidth}
                  height={280}
                  snapEnabled={true}
                  pagingEnabled={true}
                  data={products}
                  mode="parallax"
                  onSnapToItem={(index) => console.log("current index:", index)}
                  renderItem={({ item }) => (
                    <Link
                      href={{
                        pathname: "/[slug]",
                        params: {
                          slug: item.slug ? item.slug : "",
                        },
                      }}
                    >
                      <View
                        className="bg-brown border-0 rounded-2xl overflow-hidden group h-full justify-between items-center"
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
                        <View className="bg-light-dark w-full px-5 py-3 flex-row justify-between items-center">
                          <View>
                            <Text className="text-white">{item.name}</Text>
                            <Text className="text-white">
                              {item.status == "Sold"
                                ? `Sold At: Rs. ${item.finalPrice}`
                                : "Unsold"}
                            </Text>
                          </View>
                          <View>
                            <Text className="text-white">
                              No. of Bids: {item.activeBidders?.length}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Link>
                  )}
                />
              </>
            ) : (
              <>
                <Text className="text-white text-xl text-center py-8">
                  No recent auctions available
                </Text>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default RecentAuctions;
