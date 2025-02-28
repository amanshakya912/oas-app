import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  startingPrice: number;
  currentBid: number | null;
  bidIncrement: number;
  onBidSubmit: (bidAmount: number) => void;
}

const BidModal: React.FC<BidModalProps> = ({
  isOpen,
  onClose,
  productName,
  startingPrice,
  currentBid,
  bidIncrement,
  onBidSubmit,
}) => {
  // Initialize bidAmount based on currentBid and startingPrice
  const [bidAmount, setBidAmount] = useState(
    currentBid ? currentBid + bidIncrement : startingPrice
  );

  // Update bidAmount when currentBid or bidIncrement changes
  useEffect(() => {
    setBidAmount(currentBid ? currentBid + bidIncrement : startingPrice);
  }, [currentBid, startingPrice, bidIncrement]);

  const handleBidChange = (text: string) => {
    const numericValue = Number(text);
    if (!isNaN(numericValue)) {
      setBidAmount(numericValue);
    }
  };

  const handleBidSubmit = () => {
    if (bidAmount < startingPrice) {
      alert("Bid amount must be higher than the starting price.");
      return;
    }
    onBidSubmit(bidAmount);
    onClose(); // Close modal after bid submission
  };

  const incrementBid = () => {
    setBidAmount((prevBid: number) => prevBid + bidIncrement);
  };

  const decrementBid = () => {
    if (bidAmount - bidIncrement >= startingPrice) {
      setBidAmount((prevBid: number) => prevBid - bidIncrement);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={{
        backgroundColor: 'rgba(31, 41, 55, 0.5)'
      }} className="flex-1 justify-center items-center z-50">
        <View className=" bg-light-dark p-6 rounded-lg w-4/5">
          <Text className="text-2xl font-bold text-white mb-4">
            Place Your Bid on {productName}
          </Text>

          {/* Bid Input Section */}
          <View className="mb-4">
            <Text className="text-lg text-white mb-2">
              Enter your bid amount:
            </Text>
            <View className="flex-row items-center gap-x-2">
              {/* Decrement Button */}
              <TouchableOpacity
                onPress={decrementBid}
                className="bg-brown py-1 px-4 rounded-md active:opacity-75"
              >
                <Text className="text-white text-lg">-</Text>
              </TouchableOpacity>

              {/* Bid Input */}
              <View className="relative flex-1">
                <Text className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                  Rs.
                </Text>
                <TextInput
                  value={String(bidAmount)}
                  onChangeText={handleBidChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black text-center bg-white"
                  keyboardType="numeric"
                  editable={false} // Matches "readOnly" behavior
                />
              </View>

              {/* Increment Button */}
              <TouchableOpacity
                onPress={incrementBid}
                className="bg-brown py-1 px-4 rounded-md active:opacity-75"
              >
                <Text className="text-white text-lg">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit & Close Buttons */}
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={handleBidSubmit}
              className="bg-brown py-2 px-4 rounded-md active:opacity-75"
            >
              <Text className="text-white text-lg">Submit Bid</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              className="bg-red-500 py-2 px-4 rounded-md active:opacity-75"
            >
              <Text className="text-white text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BidModal;
