import { View, Text, FlatList } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Route } from "expo-router";

type FooterData = {
    id: string;
    title: string;
    iconName: keyof typeof Ionicons.glyphMap,
    route: Route
};

const footerItems: FooterData[]  = [
    {
        id:'1',
        title: 'Home',
        iconName: 'home',
        route: '/'
    },
    {
        id:'2',
        title: 'Browse',
        iconName: 'search',
        route: '/'
    },
    {
        id:'3',
        title: 'Create',
        iconName: 'add-circle',
        route: '/'
    },
    {
        id: '4',
        title: 'Profile',
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
