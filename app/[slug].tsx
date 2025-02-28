import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Api from "@/utils/Api";
import { Product, ProductSpecs } from "@/types";
import { Image } from "expo-image";
import Helper from "@/utils/Helper";
import UserData, { UserDataType } from "@/utils/UserData";
import Toast from "react-native-toast-message";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";
import { Link } from "expo-router";
import BidModal from "@/components/BidModal";
import io from "socket.io-client";
import ConfirmModal from "@/components/ConfirmModal";
import CountdownTimer from "@/components/CountdownTimer";
import ActiveBiddersModal from "@/components/ActiveBiddersModal";

const SOCKET_URL: string = Helper.BASE_URL;

const ProductDetails = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [liveBid, setLiveBid] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [details, setDetails] = useState<Product>();
  const [auctionEnd, setAuctionEnd] = useState(false);
  const [countdownDate, setCountdownDate] = useState<Date | string | number>(
    ""
  );
  const [creatorId, setCreatorId] = useState<string>("");
  const [creator, setCreator] = useState<{
    userName: string;
  }>();
  const [same, setSame] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [prodDetailsId, setProdDetailsId] = useState<string>("");
  const [prodDetails, setProdDetails] = useState<ProductSpecs>();
  const [openDModal, setOpenDModal] = useState(false);
  const [prodNotFound, setProdNotFound] = useState(false);
  const [activeBidders, setActiveBidders] = useState([]);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [live, setLive] = useState(false);
  const [isBidderModal, setIsBidderModal] = useState(false);
  const [currentBid, setCurrentBid] = useState<string | number>("");
  const [maxPrice, setMaxPrice] = useState<string | number>("");
  const [buyerId, setBuyerId] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState();
  const [sold, setSold] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [winnerUserName, setWinnerUserName] = useState();
  const [latestBidder, setLatestBidder] = useState<string>("");
  const [latestBidderUsername, setLatestBidderUsername] = useState();
  const [buyNowModal, setBuyNowModal] = useState(false);
  const openBidderModal = () => setIsBidderModal(true);
  const closeBidderModal = () => setIsBidderModal(false);
  // const navigate = useNavigate();
  const [userData, setUserData] = useState<UserDataType>({
    token: null,
    username: null,
    id: null,
  });

  useEffect(() => {
    const getUserData = async () => {
      const data = await UserData();
      setUserData(data);
      console.log("d", data);
    };
    getUserData();
  }, []);
  const handleBidNowClick = () => {
    if (userData.token) {
      if (live) {
        setIsModalOpen(true);
      } else {
        Toast.show({ type: "error", text1: "Auction is not live yet!" });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "You need to be signed in to place a bid!",
      });
    }
  };
  const handleBuyNowClick = () => {
    if (userData.token) {
      if (live) {
        setBuyNowModal(true);
      } else {
        Toast.show({ type: "error", text1: "Auction is not live yet!" });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "You need to be signed in to buy the product!",
      });
    }
  };
  const handleConfirm = async () => {
    try {
      const res = await Api.handleBuyNow(prodDetailsId);
      console.log(res);
      Toast.show({ type: "success", text1: "You have bought the product!!" });
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (e) {
      console.log(e);
    }
    setBuyNowModal(false);
  };

  const handleClose = () => {
    setBuyNowModal(false); // Close the modal if the user cancels
  };
  const handleAddToCartClick = () => {
    if (userData.token) {
      if (live) {
        setIsModalOpen(true);
      } else {
        Toast.show({ type: "error", text1: "Auction is not live yet!" });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "You need to be signed in to add product to the cart!",
      });
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const openDeleteModal = () => setOpenDModal(true);
  const closeDeleteModal = () => setOpenDModal(false);
  const handleDeleteProduct = async () => {
    try {
      await Api.deleteProduct(prodDetailsId);
      router.replace("/");
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSave = () => {
    // onSave(updatedProduct);
    Toast.show({
      type: "success",
      text1: "Product has been updated successfully!",
    });
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Function to handle decrement
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  useEffect(() => {
    const productDetails = async () => {
      try {
        const res = await Api.getProductBySlug(slug);
        console.log("res", res);
        setDetails(res);
        auctionCountdown(res.auctionStartTime, res.auctionEndTime);
        setCreatorId(res.createdBy);
        setProdDetailsId(res._id);
        setActiveBidders(res.activeBidders);
        setCurrentBid(res.currentBid);
        setMaxPrice(res.buyNowPrice);
        if (res.finalPrice) {
          setFinalPrice(res.finalPrice);
        }
        if (res.boughtBy) {
          setBuyerId(res.boughtBy);
        }
        if (res.status == "Sold") {
          setSold(true);
        } else if (res.status == "Withdrawn") {
          setWithdrawn(true);
        }
      } catch (e) {
        console.log("err", e);
        setProdNotFound(true);
      }
    };
    productDetails();
  }, [refreshKey]);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const fetchedUsernames = await Promise.all(
          activeBidders.map(async (bidderId) => {
            try {
              const res = await Api.getUserById(bidderId);
              // console.log('API Response for bidderId', bidderId, ':', res);
              return res.userName; // Adjust this based on actual response structure
            } catch (error) {
              // console.error(`Error fetching username for bidder ${bidderId}:`, error);
              return null; // Return null or a default value in case of error
            }
          })
        );
        console.log("Fetched Usernames:", fetchedUsernames);
        setUsernames(fetchedUsernames.filter((username) => username !== null)); // Filter out nulls if any
      } catch (error) {
        console.error("Error fetching usernames:", error);
      }
    };

    fetchUsernames();
  }, [activeBidders]);

  useEffect(() => {
    const getProductCreator = async () => {
      try {
        const res = await Api.getUserById(creatorId);
        console.log("creator", res);
        setCreator(res);
      } catch (e) {
        console.log("err", e);
      }
    };
    if (creatorId) {
      getProductCreator();
      if (creatorId == userData.id) {
        console.log("hey", creatorId, userData.id);
        setSame(true);
      }
    }
  }, [creatorId]);
  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const res = await Api.getProductDetailsById(prodDetailsId);
        console.log("prod details", res);
        setProdDetails(res.productDetails);
      } catch (e) {
        console.log("err", e);
      }
    };
    if (prodDetailsId) {
      getProductDetails();
    }
  }, [prodDetailsId]);
  const auctionCountdown = (
    auctionStartTime: string,
    auctionEndTime: string
  ) => {
    const currentTime = Date.now(); // Get current time in milliseconds
    // Determine which date to countdown to
    if (currentTime < new Date(auctionStartTime).getTime()) {
      // Auction hasn't started yet
      console.log("st", auctionStartTime);
      setCountdownDate(new Date(auctionStartTime).getTime());
      console.log("ct", countdownDate);
    } else if (
      currentTime >= new Date(auctionStartTime).getTime() &&
      currentTime < new Date(auctionEndTime).getTime()
    ) {
      // Auction is live
      setLive(true);
      setCountdownDate(new Date(auctionEndTime).getTime());
    } else {
      setAuctionEnd(true);
    }
  };

  const handleBidSubmit = async (bidAmount: number) => {
    // Handle the bid submission logic here
    console.log("Bid Amount:", bidAmount);
    const productId = details?._id;
    try {
      const res = await Api.placeBid(productId ? productId : "", bidAmount);
      console.log(res);
      Toast.show({
        type: "success",
        text1: "Your Bid Has been registered successfully!!",
      });
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "An unexpected error occured. Please try again later",
      });
      console.log(e);
    }
  };

  useEffect(() => {
    const getWinnerUserName = async () => {
      try {
        const res = await Api.getUserById(buyerId);
        setWinnerUserName(res.userName);
      } catch (e) {
        console.log(e);
      }
    };
    if (buyerId) {
      getWinnerUserName();
    }
  }, [buyerId]);
  useEffect(() => {
    const handleAuctionEnd = async () => {
      try {
        const res = await Api.handleAuctionEnd(prodDetailsId);
        console.log("res", res);
        // Toast.showe{type:'error', text1:ss('You have succesfully won the auction!'})
      } catch (error) {
        console.log("err", error);
        if (axios.isAxiosError(error)) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.log('e', error)
            Toast.show({ type: "error", text1: error.response.data.error });
          } else if (error.response) {
            Toast.show({
              type: "error",
              text1: `Error ${error.response.status}: ${error.response.statusText}`,
            });
          } else {
            Toast.show({
              type: "error",
              text1: "Network error. Please try again.",
            });
          }
        } else {
          Toast.show({
            type: "error",
            text1: "An unexpected error occurred. Please try again.",
          });
        }
      }
    };
    if (currentBid !== null && maxPrice !== null) {
      if (currentBid >= maxPrice) {
        console.log(
          "Current bid matches or exceeds the max price. Auction may end or user can buy now."
        );
        handleAuctionEnd();
      } else {
        console.log("Current bid updated:", currentBid);
      }
    }
  }, [currentBid, maxPrice]);

  const handleCountdownComplete = () => {
    if (!live) {
      // Auction has just started
      setLive(true);
      setCountdownDate(
        new Date(
          details?.auctionEndTime ? details?.auctionEndTime : ""
        ).getTime()
      );
    } else {
      // Auction has ended
      handleAuctionEnd();
    }
  };

  useEffect(() => {
    // Re-render countdown component when countdownDate changes
    console.log("Updated Countdown Date:", countdownDate);
  }, [countdownDate]);

  const handleAuctionEnd = async () => {
    try {
      const res = await Api.handleAuctionEnd(details?._id ? details?._id : "");
      console.log("Auction ended:", res);
      setAuctionEnd(true);
      if (res.status === "Sold") {
        setSold(true);
        setFinalPrice(res.product.finalPrice);
        setBuyerId(res.product.boughtBy);
      } else if (res.status === "Withdrawn") {
        setWithdrawn(true);
      }
    } catch (error) {
      console.error("Failed to end auction:", error);
    }
  };

  useEffect(() => {
    if (!prodDetailsId) return; // Ensure prodDetailsId is available before setting up the listener
    const socket = io(SOCKET_URL, {
      transports: ["websocket"], // Prevents polling issues in React Native
    });
    socket.on(
      "bidUpdated",
      ({
        productId: updatedId,
        currentBid,
        activeBidders,
        numberOfBids,
        bidderId,
      }) => {
        console.log("Socket event received:", {
          productId: prodDetailsId,
          updatedId,
          currentBid,
          numberOfBids,
        });
        if (updatedId === prodDetailsId) {
          setDetails(
            (prevDetails) =>
              ({
                ...prevDetails,
                numberOfBids: numberOfBids,
                activeBidders: activeBidders,
                currentBid: currentBid,
              } as Product)
          );
          setActiveBidders(activeBidders);
          setLatestBidder(bidderId);
        }
      }
    );

    socket.on(
      "auctionEnded",
      ({ productId: updatedId, finalPrice, status, boughtBy }) => {
        console.log("Auction ended:", {
          productId: prodDetailsId,
          updatedId,
          finalPrice,
          status,
          boughtBy,
        });
        if (updatedId === prodDetailsId) {
          setDetails(
            (prevDetails) =>
              ({
                ...prevDetails,
                finalPrice: finalPrice,
                status: status,
                boughtBy: boughtBy,
              } as Product)
          );
          setAuctionEnd(true);
          if (status === "Sold") {
            setSold(true);
            setFinalPrice(finalPrice);
            setBuyerId(boughtBy);
          } else if (status === "Withdrawn") {
            setWithdrawn(true);
          }
        }
      }
    );

    socket.on("productSold", ({ productId, finalPrice, buyerId, status }) => {
      console.log("Product sold:", {
        productId: prodDetailsId,
        finalPrice,
        buyerId,
        status,
      });

      if (productId === prodDetailsId) {
        setDetails(
          (prevDetails) =>
            ({
              ...prevDetails,
              finalPrice: finalPrice,
              status: status,
              boughtBy: buyerId, // Assuming buyerId is the ID of the buyer
            } as Product)
        );
        setSold(true);
        setFinalPrice(finalPrice);
        setBuyerId(buyerId);
      }
    });

    return () => {
      socket.off("bidUpdated");
      socket.off("auctionEnded");
      socket.off("productSold");
    };
  }, [prodDetailsId]);

  useEffect(() => {
    const getLatestBidder = async () => {
      try {
        console.log("lb", latestBidder);
        const res = await Api.getUserById(latestBidder);
        setLatestBidderUsername(res.userName);
      } catch (e) {
        console.log(e);
      }
    };
    if (latestBidder) {
      getLatestBidder();
    }
  }, [latestBidder]);
  return (
    <View className="bg-black flex-1">
      <View className="bg-light-dark h-1/4 rounded-br-[100px] items-center justify-center">
        <Text className="text-white font-lora text-2xl">{details?.name}</Text>

        {latestBidderUsername && (
          <Text className="text-white font-lora text-lg">
            Lastest Bidder: {latestBidderUsername}
          </Text>
        )}
      </View>
      <ScrollView className="px-4 mt-5">
        <View className="flex-1 bg-brown rounded-3xl  h-[260px] mb-4 items-center ">
          <Image
            source={{ uri: Helper.BASE_URL + details?.images[0] }}
            style={{
              width: "100%",
              height: "100%",
              padding: 16,
            }}
            className="flex-1"
          />
        </View>
        <View className="w-full">
          <View className="mb-4 ">
            {auctionEnd ? (
              <>
                <View className="bg-light-dark p-2  rounded-3xl">
                  <Text className="text-white text-center">
                    Auction Time Has Ended
                  </Text>
                </View>
              </>
            ) : (
              <>
                {countdownDate ? (
                  <>
                    {sold ? (
                      <>
                        <View className="bg-light-dark p-2  rounded-3xl">
                          <Text className="text-white text-center">
                            Auction Has Ended
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View className="bg-light-dark p-2 rounded-3xl flex-row items-center justify-center gap-5">
                          <Text className="text-white text-center text-xl font-lora border border-r border-white border-y-0 border-l-0 px-4">
                            {live ? "Live Auction" : "Auction Till Live"}
                          </Text>
                          <CountdownTimer
                            countdownDate={countdownDate}
                            onComplete={handleCountdownComplete}
                          />
                        </View>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <View className="bg-light-dark p-2  rounded-3xl">
                      <Text className="text-white text-center">Loading...</Text>
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </View>
        <View className="flex-1 bg-light-dark rounded-3xl p-4">
          <View className="justify-between flex-row mb-2">
            <View className="flex-row items-center justify-start gap-3">
              <View className="bg-black px-3 py-2 rounded-full">
                <Ionicons name="person" size={20} color={"white"} />
              </View>
              <View>
                <Text className="text-white">{creator?.userName}</Text>
              </View>
            </View>
            <Link
              href={{
                pathname: "/user/[username]",
                params: {
                  username: creator?.userName ? creator?.userName : "",
                },
              }}
              asChild
            >
              <Pressable className="bg-brown rounded-md px-4 py-2">
                <Text className="text-white">Contact Seller</Text>
              </Pressable>
            </Link>
          </View>
          <View className="justify-between flex-row items-center border border-x-0 border-t border-b-0 border-white mt-2 pt-4 pb-2">
            <Text className="text-white text-lg">Current Bid</Text>
            <Text className="text-white text-lg">
              Rs.{" "}
              {details?.currentBid == 0
                ? details?.startingPrice
                : details?.currentBid}
            </Text>
          </View>
          <View className="justify-between flex-row items-center py-2">
            <Text className="text-white text-lg">No. of Bids:</Text>
            <Text className="text-white text-lg">{details?.numberOfBids}</Text>
          </View>
          <View className="justify-between flex-row items-center py-2">
            <Text className="text-white text-lg">Max Price</Text>
            <Text className="text-white text-lg">
              Rs. {details?.buyNowPrice}
            </Text>
          </View>
          <View className="justify-between flex-row items-center py-2">
            <Text className="text-white text-lg">Active Bidders</Text>
            <Pressable onPress={openBidderModal} className="bg-brown rounded-md px-4 py-2">
              <Text className="text-white">View</Text>
            </Pressable>
            {isBidderModal && (
              <ActiveBiddersModal
                isVisible={isBidderModal}
                activeBidders={usernames}
                onClose={closeBidderModal}
              />
            )}
          </View>
          {same ? (
            <></>
          ) : (
            <>
              <View className="justify-between flex-row items-center py-2">
                <Text className="text-white text-lg">
                  Quantity ({details?.quantity} Available)
                </Text>

                <View className="flex-row bg-black py-2 items-center justify-center">
                  <TouchableOpacity
                    onPress={decrementQuantity}
                    className="text-base px-4"
                    activeOpacity={0.7}
                  >
                    <Text className="text-white">-</Text>
                  </TouchableOpacity>

                  <View className="border-x border-gray-500 px-6">
                    <Text className="text-white text-base">{quantity}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={incrementQuantity}
                    disabled={
                      quantity >= (details?.quantity ? details?.quantity : 1)
                    }
                    className={`text-base px-4 ${
                      quantity >= (details?.quantity ? details?.quantity : 1)
                        ? "opacity-50"
                        : ""
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
          {same ? (
            <>
              {sold ? (
                <>
                  <Text className="text-white text-lg my-2">
                    Auction has been won by{" "}
                    <Link
                      href={{
                        pathname: "/user/[username]",
                        params: {
                          username: winnerUserName ? winnerUserName : "",
                        },
                      }}
                    >
                      {winnerUserName}
                    </Link>{" "}
                    at Rs. {finalPrice}
                  </Text>
                </>
              ) : (
                <>
                  <View className="flex-row gap-x-5 my-2">
                    {/* Edit Product Button */}
                    <TouchableOpacity
                      onPress={openModal}
                      activeOpacity={0.7}
                      className="flex-1 rounded-md bg-brown py-2 px-5"
                    >
                      <Text className="text-white text-center text-[15px]">
                        Edit Product
                      </Text>
                    </TouchableOpacity>

                    {/* Delete Product Button */}
                    <TouchableOpacity
                      onPress={openDeleteModal}
                      activeOpacity={0.7}
                      className="flex-1 rounded-md bg-brown py-2 px-5"
                    >
                      <Text className="text-white text-center text-[15px]">
                        Delete Product
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          ) : (
            <>
              {sold ? (
                <>
                  {buyerId == userData.id ? (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        className="flex-1 rounded-md bg-brown py-2 px-5 my-2"
                      >
                        <Text className="text-white text-center text-[15px]">
                          Proceed to Checkout
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text className="text-white text-lg my-2">
                        Auction has been won by{" "}
                        <Link
                          href={{
                            pathname: "/user/[username]",
                            params: {
                              username: winnerUserName ? winnerUserName : "",
                            },
                          }}
                        >
                          {winnerUserName}
                        </Link>{" "}
                        at Rs. {finalPrice}
                      </Text>
                    </>
                  )}
                </>
              ) : (
                <>
                  <View className="flex-row gap-x-5 my-2">
                    <TouchableOpacity
                      onPress={handleBidNowClick}
                      activeOpacity={0.7}
                      className="flex-1 rounded-md bg-brown py-2 px-5"
                    >
                      <Text className="text-white text-center text-[15px]">
                        Bid Now
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleBuyNowClick}
                      activeOpacity={0.7}
                      className="flex-1 rounded-md bg-brown py-2 px-5"
                    >
                      <Text className="text-white text-center text-[15px]">
                        Buy Now
                      </Text>
                    </TouchableOpacity>
                    <BidModal
                      isOpen={isModalOpen}
                      onClose={handleCloseModal}
                      productName={details?.name ?? "Unknown Product"} // Ensure a default string
                      startingPrice={details?.startingPrice ?? 0} // Default to 0 if undefined
                      currentBid={details?.currentBid ?? null} // Handle null correctly
                      bidIncrement={details?.bidIncrement ?? 1} // Default to 1
                      onBidSubmit={handleBidSubmit}
                    />
                    <ConfirmModal
                      show={buyNowModal}
                      onClose={handleClose}
                      onConfirm={handleConfirm}
                      maxPrice={maxPrice}
                    />
                  </View>
                </>
              )}
            </>
          )}
        </View>
        <View className="flex-1 bg-light-dark rounded-3xl p-4 my-4">
          <Text className="text-white font-lora text-2xl border border-b border-x-0 border-t-0 border-white pb-2">
            About the Product
          </Text>
          <Text className="text-white py-2 text-lg">
            {details?.description}
          </Text>
          <Text className="text-white font-lora text-xl py-2">
            Product Specifications
          </Text>
          {prodDetails && (
            <>
              <View className="flex-row justify-between">
                <Text className="text-white text-lg">Battery Power:</Text>
                <Text className="text-white text-lg">
                  {prodDetails.battery_power} mAh
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white text-lg">Bluetooth:</Text>
                <Text className="text-white text-lg">
                  {prodDetails.blue ? "Yes" : "No"}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white text-lg">Dual SIM:</Text>
                <Text className="text-white text-lg">
                  {prodDetails.dual_sim ? "Yes" : "No"}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white text-lg">Front Camera:</Text>
                <Text className="text-white text-lg">{prodDetails.fc} MP</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white text-lg">Internal Memory:</Text>
                <Text className="text-white text-lg">
                  {prodDetails.int_memory} GB
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white text-lg">Number of Cores:</Text>
                <Text className="text-white text-lg">
                  {prodDetails.n_cores}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white text-lg">Primary Camera:</Text>
                <Text className="text-white text-lg">{prodDetails.pc} MP </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white text-lg">Pixel Height:</Text>
                <Text className="text-white text-lg">
                  {prodDetails.px_height} px
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white text-lg">Pixel Width:</Text>
                <Text className="text-white text-lg">
                  {prodDetails.px_width} px
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white text-lg">RAM:</Text>
                <Text className="text-white text-lg">{prodDetails.ram} MB</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white text-lg">WiFi Support:</Text>
                <Text className="text-white text-lg">
                  {prodDetails.wifi ? "Yes" : "No"}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white text-lg">Price Range:</Text>
                <Text className="text-white text-lg">
                  {(() => {
                    switch (prodDetails.price_range) {
                      case 0:
                        return "Rs. 5000 - Rs. 15000";
                      case 1:
                        return "Rs. 15000 - Rs. 25000";
                      case 2:
                        return "Rs. 25000 - Rs. 50000";
                      case 3:
                        return "Rs. 50000+";
                      default:
                        return "Unknown";
                    }
                  })()}
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetails;
