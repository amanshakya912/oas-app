import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import UserData, { UserDataType } from "@/utils/UserData";

const Header = () => {
  const pathname = usePathname();
  const [userData, setUserData] = useState<UserDataType>({
    token: null,
    username: null,
    id: null,
  });

  useEffect(() => {
    const getUserData = async () => {
      const data = await UserData(); 
      setUserData(data);
      console.log('d',data)
    };
    getUserData();
  }, []);
  return (
    <>
      <View className="flex flex-row justify-between items-center w-full p-4 bg-light-dark">
        <Text className="font-lora-bold text-white text-xl">OAS</Text>
        {(pathname != "/signup") && (pathname != "/signin") ? (
          <>
            {userData.token ? (<>
            <View className="flex-row items-center gap-2">
              <Ionicons name={'person'} size={20} color="white" />

              <Link href={"/signup"} asChild>
                <Text className="text-white">
              {userData.username}</Text>
            </Link>
            </View></>) : (<>
              <Link href={"/signup"} asChild>
              <Pressable className="bg-brown px-8 py-2 rounded-md">
                <Text className="text-white">Sign Up</Text>
              </Pressable>
            </Link></>)}
          </>
        ) : (
          <></>
        )}
      </View>
    </>
  );
};

export default Header;
