import { View, Text, FlatList } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from "expo-router";
import { FooterData } from "@/types";



const footerItems: FooterData[]  = [
    {
        id:'1',
        title: 'Home\u00A0',
        iconName: 'home',
        route: '/'
    },
    {
        id:'2',
        title: 'Browse\u00A0\u00A0',
        iconName: 'search',
        route: '/'
    },
    {
        id:'3',
        title: 'Create\u00A0',
        iconName: 'add-circle',
        route: '/create-auction'
    },
    {
        id: '4',
        title: 'Profile\u00A0',
        iconName: 'person',
        route: '/'
    }
]

const Footer = () => {
    return (
        <>
            <View className="h-18 bg-light-dark justify-center items-center w-full">
               <FlatList
                    data={footerItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Link href={item.route}>
                            <View className="items-center">
                                <Ionicons name={item.iconName} size={20} color="white" />
                                <Text className="text-white pt-1">{item.title}</Text>
                            </View>
                        </Link>
                    )}
                    className="p-4"
                    contentContainerStyle={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}
               />
            </View>
        </>
    );
};

export default Footer;
