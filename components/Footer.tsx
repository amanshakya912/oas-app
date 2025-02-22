import { View, Text, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { FooterData } from "@/types";
import { useEffect, useState } from "react";
import UserData, { UserDataType } from "@/utils/UserData";

const Footer = () => {
  const [userData, setUserData] = useState<UserDataType>({
    token: null,
    username: null,
    id: null,
  });

  useEffect(() => {
    const getUserData = async () => {
      const data = await UserData();
      setUserData(data);
    };
    getUserData();
  }, []);
  const footerItems: FooterData[] = [
    {
      id: "1",
      title: "Home\u00A0",
      iconName: "home",
      route: "/",
    },
    {
      id: "2",
      title: "Browse\u00A0\u00A0",
      iconName: "search",
      route: "/",
    },
    {
      id: "3",
      title: "Create\u00A0",
      iconName: "add-circle",
      route: "/create-auction",
    },
    {
      id: "4",
      title: "Profile\u00A0",
      iconName: "person",
      route: userData.username ? "/user/[username]" : "/signin",
    },
  ];
  return (
    <>
      <View className="h-18 bg-light-dark justify-center items-center w-full">
        <FlatList
          data={footerItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={item.id != '4' ? item.route : {
                pathname: item.route,
                params: { username: userData.username ? userData.username : ''}}}
            >
              <View className="items-center">
                <Ionicons name={item.iconName} size={20} color="white" />
                <Text className="text-white pt-1">{item.title}</Text>
              </View>
            </Link>
          )}
          className="p-4"
          contentContainerStyle={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        />
      </View>
    </>
  );
};

export default Footer;
