import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Product } from "@/types";
import Api from "@/utils/Api";
import Loader from "./Loader";
import { Image } from "expo-image";
import { Link } from "expo-router";
import Helper from "@/utils/Helper";
import CountdownTimer from "./CountdownTimer";

interface AuctionListProps {
  status: string;
}

const AuctionList: React.FC<AuctionListProps> = ({ status }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const res = await Api.getProducts();
        const currentTime = new Date();
        const filteredProducts = res.filter((product: Product) => {
          switch (status) {
            case "active":
              const endTime = new Date(product.auctionEndTime);
              const startTime = new Date(product.auctionStartTime);
              return (
                currentTime < endTime &&
                currentTime >= startTime &&
                product.status !== "Sold"
              );
            case "upcoming":
              const startTime1 = new Date(product.auctionStartTime);
              return currentTime < startTime1;
            case "recent":
              const endTime2 = new Date(product.auctionEndTime);
              return (
                currentTime > endTime2 ||
                ["Sold", "Withdrawn"].includes(
                  product.status ? product.status : ""
                )
              );
            default:
              return null;
          }
        });
        setProducts(filteredProducts);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    getProducts();
  }, [status]);
  const handleCountdownComplete = () => {};
  return (
    <ScrollView>
      <View className="p-4">
        <Text className="text-white text-center pb-4 text-xl font-lora">
          {(() => {
            switch (status) {
              case "active":
                return "Live";
              case "upcoming":
                return "Upcoming";
              case "recent":
                return "Recent";
              default:
                return "";
            }
          })()}{" "}
          Auctions
        </Text>
        <View>
          {loading ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              {products.length > 0 ? (
                <>
                  {products.map((item) => (
                    <>
                      <Link
                        key={item._id}
                        href={{
                          pathname: "/[slug]",
                          params: {
                            slug: item.slug ? item.slug : "",
                          },
                        }}
                      >
                        <View className="bg-brown border-0 rounded-2xl overflow-hidden group h-[300px] justify-between items-center">
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
                          {status != "recent" && (
                            <>
                              <View className="absolute bottom-14 left-4">
                                <View className="w-full">
                                  <View className="bg-light-dark p-2 mb-5 rounded-3xl flex-row items-center justify-center gap-5 w-[80%]">
                                    <CountdownTimer
                                      countdownDate={
                                        new Date(
                                          status == "active"
                                            ? item.auctionEndTime
                                            : item.auctionStartTime
                                        )
                                      }
                                      onComplete={handleCountdownComplete}
                                    />
                                  </View>
                                </View>
                              </View>
                            </>
                          )}
                          <View className="bg-light-dark w-full px-5 py-3 flex-row justify-between items-center">
                            <View>
                              <Text className="text-white">{item.name}</Text>
                              <Text className="text-white">
                                {(() => {
                                  switch (status) {
                                    case "active":
                                      return `Current Bid: Rs. ${item.currentBid}`;
                                    case "upcoming":
                                      return `Starting Price: Rs. ${item.startingPrice}`;
                                    case "recent":
                                      return item.status == "Sold"
                                        ? `Sold At: Rs. ${item.finalPrice}`
                                        : "Unsold";
                                    default:
                                      return null;
                                  }
                                })()}
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
                    </>
                  ))}
                </>
              ) : (
                <>
                  <Text className="text-white text-xl text-center py-8">
                    No {status} auctions available
                  </Text>
                </>
              )}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default AuctionList;
