import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, usePathname } from "expo-router";
const Header = () => {
  const pathname = usePathname();
  return (
    <>
      <View className="flex flex-row justify-between items-center w-full p-4 bg-light-dark">
        <Text className="font-lora-bold text-white text-xl">OAS</Text>
        {(pathname != "/signup") && (pathname != "/signin") ? (
          <>
            <Link href={"/signup"} asChild>
              <Pressable className="bg-brown px-8 py-2 rounded-md">
                <Text className="text-white">Sign Up</Text>
              </Pressable>
            </Link>
          </>
        ) : (
          <></>
        )}
      </View>
    </>
  );
};

export default Header;
