import { View, Text, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import Ionicons from "@expo/vector-icons/Ionicons";
import Api from "@/utils/Api";
import { SignInFormInputs } from "@/types";

const SignIn = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async(data: SignInFormInputs) => {
    console.log(data)
    // try {
    // } catch(e: any){
    //   console.log(e)
    // }
  };

  return (
    <View className="bg-black flex-1 gap-5">
      <View className="bg-light-dark h-1/4 rounded-br-[100px] items-center justify-center">
        <Text className="text-white font-lora text-2xl">Log In</Text>
        <View className="flex-row items-center justify-center mt-5 gap-5">
          <Text className="text-white font-lora text-md ">
            Create a new account?
          </Text>
          <Link href={"/signup"} asChild>
            <Pressable className="bg-brown rounded-md px-4 py-2">
              <Text className="text-white">Sign Up</Text>
            </Pressable>
          </Link>
        </View>
      </View>
      <ScrollView>
        <View className="p-4">
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
            }}
            render={({ field: { value, onBlur, onChange } }) => (
              <View className="gap-2">
                <Text className="text-white">Email</Text>
                <View className="w-full bg-white p-3 rounded-lg mb-4 relative flex-row items-center gap-4">
                  <Ionicons name="mail" size={16} />
                  <TextInput
                    placeholder="Enter your email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="flex-1 text-black"
                  />
                </View>
              </View>
            )}
          />
          {errors.email && (
            <Text className="text-red-500 mb-2">{errors.email.message}</Text>
          )}
          <Controller
            control={control}
            rules={{
              required: "Password is required.",
            }}
            name="password"
            render={({ field: { value, onBlur, onChange } }) => (
              <View className="gap-2">
                <Text className="text-white">Password</Text>
                <View className="w-full bg-white p-3 rounded-lg mb-4 relative flex-row items-center gap-4">
                  <Ionicons name="key" size={16} />
                  <TextInput
                    placeholder="Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                    value={value}
                    className="flex-1 text-black"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <>
                        <Ionicons name="eye-off" size={20} />
                      </>
                    ) : (
                      <>
                        <Ionicons name="eye" size={20} />
                      </>
                    )}
                  </Pressable>
                </View>
              </View>
            )}
          />
          {errors.password && (
            <Text className="text-red-500 mb-2">{errors.password.message}</Text>
          )}
          <Pressable
            className="bg-brown rounded-md my-2"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="px-8 py-4 text-white text-center">Log In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignIn;
