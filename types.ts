import Ionicons from '@expo/vector-icons/Ionicons';
import { Route } from "expo-router";

export type FooterData = {
    id: string;
    title: string;
    iconName: keyof typeof Ionicons.glyphMap,
    route: Route
};

export type CreateAuctionFormInputs = {
    category: string;
    name: string;
    description: string;
    images: string[];
    quantity: number;
    battery_power: number;
    blue: number;
    dual_sim: number;
    fc: number;
    int_memory: number;
    ram:number;
    wifi: number
    pc: number
    n_cores: number
    px_height: number
    px_width: number
    startingPrice: string
    buyNowPrice: string
    bidIncrement: string
    auctionStartTime: string
    auctionEndTime: string
};

export type SignInFormInputs = {
    email: string;
    password: string;
};

export type SignUpFormInputs = {
    firstName: string;
    lastName: string;
    userName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  