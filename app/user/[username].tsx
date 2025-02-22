import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import UserData, { UserDataType } from "@/utils/UserData";
import Api from "@/utils/Api";
import { User } from "@/types";
import * as SecureStore from "expo-secure-store";

const Profile = () => {
  const { username } = useLocalSearchParams<{ username: string }>();
  console.log("y", username);
  const [userData, setUserData] = useState<UserDataType>({
    token: null,
    username: null,
    id: null,
  });
  const [user, setUser] = useState<User | null>();
  const [userId, setUserId] = useState(null);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const data = await UserData();
      setUserData(data);
    };
    const fetchUser = async () => {
      try {
        const response = await Api.getUser(username);
        console.log(response);
        setUserId(response._id);
        setUser(response);
      } catch (e) {
        console.log("err", e);
        setUser(null);
      }
    };
    getUserData();
    if (username) {
      fetchUser();
    }
  }, []);
  const logout = () => {
    SecureStore.deleteItemAsync("token")
    SecureStore.deleteItemAsync("username")
    SecureStore.deleteItemAsync("id")
    router.replace("/signin");
  }
  useEffect(() => {
    if (username) {
      console.log("user", username, userData.username);
      username == userData.username ? setIsUser(true) : setIsUser(false);
    }
  }, [userData.username, username]);

  return (
    <>
      <View className="bg-black flex-1">
        <View className="bg-light-dark h-1/4 rounded-br-[100px] items-center justify-start flex-row px-4 gap-4">
          <View
            style={{
              width: 80,
              height: 80,
            }}
            className="bg-brown rounded-full flex items-center justify-center font-bold"
          >
            <Text className="text-white text-2xl">
              {user?.firstName.charAt(0)}
              {user?.lastName.charAt(0)}
            </Text>
          </View>
          <View>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white font-lora-bold text-2xl">
                  {user?.firstName} {user?.lastName}
                </Text>
              </View>
            </View>
            <Text className="text-white">@{user?.userName}</Text>
            <Text className="text-white">Email: {user?.email}</Text>
            <Text className="text-white">
              Joined On:{" "}
              {user?.createdAt &&
                new Date(user?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </Text>
          </View>
          {isUser && (
            <Pressable onPress={logout} className="bg-brown rounded-md px-4 py-2">
              <Text className="text-white text-center">Logout</Text>
            </Pressable>
          )}
        </View>
        <View className="flex-row w-full gap-4 p-4">
          <Pressable className="bg-brown rounded-md px-4 py-2 flex-1">
            <Text className="text-white text-center">Edit Account</Text>
          </Pressable>
          <Pressable className="bg-brown rounded-md px-4 py-2 flex-1">
            <Text className="text-white text-center">Delete Account</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default Profile;
