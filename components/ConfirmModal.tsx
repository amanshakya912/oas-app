import React from "react";
import { View, Text, Pressable, Modal } from "react-native";

interface ConfirmModalProps {
    show: boolean,
    onClose: () => void;
    onConfirm: () => void;
    maxPrice: number | string
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ show, onClose, onConfirm, maxPrice }) => {
  return (
    <Modal
      transparent
      visible={show}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-[#242628] p-6 rounded-md w-4/5">
          <Text className="text-xl font-semibold mb-4 text-white">
            Are you sure you want to buy at the maximum price of Rs. {maxPrice}?
          </Text>
          <View className="flex-row justify-between">
            <Pressable
              onPress={onClose}
              className="bg-gray-300 px-4 py-2 rounded-md"
            >
              <Text className="text-black">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className="bg-green-600 px-4 py-2 rounded-md"
            >
              <Text className="text-white">Confirm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
