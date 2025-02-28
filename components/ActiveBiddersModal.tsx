import React from "react";
import { View, Text, TouchableOpacity, FlatList, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";

interface ActiveBiddersModalProps {
  activeBidders: string[];
  isVisible: boolean;
  onClose: () => void;
}

const ActiveBiddersModal: React.FC<ActiveBiddersModalProps> = ({
  activeBidders,
  isVisible,
  onClose,
}) => {

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50 p-6">
        <View className="bg-light-dark p-6 rounded-lg w-full max-w-lg mx-auto">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-white">
              Active Bidders
            </Text>
          </View>

          {/* Bidders List */}
          {activeBidders.length > 0 ? (
            <FlatList
              data={activeBidders}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View className="py-2 flex-row justify-between">
                  <Text className="text-white">Bidder {index + 1}</Text>
                  <Link href={{
                    pathname: '/user/[username]',
                    params: {
                        username: item
                    }
                  }}><Text className="text-amber-400 underline">{item}</Text></Link>
                </View>
              )}
              ItemSeparatorComponent={() => (
                <View className="border-b border-gray-600" />
              )}
            />
          ) : (
            <Text className="text-white text-center">
              No active bidders yet.
            </Text>
          )}

          {/* Close Button */}
          <View className="mt-4 flex-row justify-end">
            <TouchableOpacity
              onPress={onClose}
              className="bg-brown px-4 py-2 rounded-md"
            >
              <Text className="text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ActiveBiddersModal;
