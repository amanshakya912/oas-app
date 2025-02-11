import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Link } from "expo-router";

type FormInputs = {
  firstName: string;
  lastName: string;
  userName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch("password");

  const onSubmit = (data: FormInputs) => console.log(data);

  return (
    <>
      <View className="bg-black flex-1 gap-5">
        <View className="bg-light-dark h-1/4 rounded-br-[100px] items-center justify-center">
          <Text className="text-white font-lora text-2xl">
            Create a New Account
          </Text>
          <View className="flex-row items-center justify-center mt-5 gap-5">
            <Text className="text-white font-lora text-md ">
              Already have an account?
            </Text>
            <Link href={"/signin"} asChild>
              <Pressable className="bg-brown rounded-md px-4 py-2">
                <Text className="text-white">Log In</Text>
              </Pressable>
            </Link>
          </View>
        </View>
        <ScrollView>
          <View className="p-4">
            <Controller
              control={control}
              rules={{
                required: "First Name is required.",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Invalid First Name",
                },
              }}
              name="firstName"
              render={({ field: { value, onBlur, onChange } }) => (
                <View className="gap-2">
                  <Text className="text-white">First Name</Text>
                  <View className="w-full bg-white p-3 rounded-lg mb-4 relative flex-row items-center gap-4">
                    <Ionicons name="person" size={16} />
                    <TextInput
                      placeholder="First Name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="flex-1 text-black"
                    />
                  </View>
                </View>
              )}
            />
            {errors.firstName && (
              <Text className="text-red-500 mb-2">
                {errors.firstName.message}
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: "Last Name is required.",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Invalid Last Name",
                },
              }}
              name="lastName"
              render={({ field: { value, onBlur, onChange } }) => (
                <View className="gap-2">
                  <Text className="text-white">Last Name</Text>
                  <View className="w-full bg-white p-3 rounded-lg mb-4 relative flex-row items-center gap-4">
                    <Ionicons name="person" size={16} />
                    <TextInput
                      placeholder="Last Name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="flex-1 text-black"
                    />
                  </View>
                </View>
              )}
            />
            {errors.lastName && (
              <Text className="text-red-500 mb-2">
                {errors.lastName.message}
              </Text>
            )}

            <Controller
              control={control}
              rules={{
                required: "Username is required.",
                pattern: {
                  value: /^[A-Za-z0-9_]+$/,
                  message:
                    "Username can only contain letters, numbers, and underscores",
                },
              }}
              name="userName"
              render={({ field: { value, onBlur, onChange } }) => (
                <View className="gap-2">
                  <Text className="text-white">User Name</Text>
                  <View className="w-full bg-white p-3 rounded-lg mb-4 relative flex-row items-center gap-4">
                    <Ionicons name="person" size={16} />
                    <TextInput
                      placeholder="Username"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="flex-1 text-black"
                    />
                  </View>
                </View>
              )}
            />
            {errors.userName && (
              <Text className="text-red-500 mb-2">
                {errors.userName.message}
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: "Phone No. is required.",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be exactly 10 digits",
                },
              }}
              name="phone"
              render={({ field: { value, onBlur, onChange } }) => (
                <View className="gap-2">
                  <Text className="text-white">Phone No.</Text>
                  <View className="w-full bg-white p-3 rounded-lg mb-4 relative flex-row items-center gap-4">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="call" size={16} />
                      <Text>+977</Text>
                    </View>
                    <TextInput
                      placeholder="Phone Number"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="flex-1 text-black"
                    />
                  </View>
                </View>
              )}
            />
            {errors.phone && (
              <Text className="text-red-500 mb-2">{errors.phone.message}</Text>
            )}
            <Controller
              control={control}
              rules={{
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              }}
              name="email"
              render={({ field: { value, onBlur, onChange } }) => (
                <View className="gap-2">
                  <Text className="text-white">Email</Text>
                  <View className="w-full bg-white p-3 rounded-lg mb-4 relative flex-row items-center gap-4">
                    <Ionicons name="mail" size={16} />
                    <TextInput
                      placeholder="Email"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="flex-1 text-black"
                      keyboardType="email-address"
                      autoCapitalize="none"
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
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
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
              <Text className="text-red-500 mb-2">
                {errors.password.message}
              </Text>
            )}
            <Controller
              control={control}
              rules={{
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              name="confirmPassword"
              render={({ field: { value, onBlur, onChange } }) => (
                <View className="gap-2">
                  <Text className="text-white">Confirm Password</Text>
                  <View className="w-full bg-white p-3 rounded-lg mb-4 relative flex-row items-center gap-4">
                    <Ionicons name="key" size={16} />
                    <TextInput
                      placeholder="Confrim Password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      secureTextEntry={!showConfirmPassword}
                      value={value}
                      className="flex-1 text-black"
                    />
                    <Pressable
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
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
            {errors.confirmPassword && (
              <Text className="text-red-500">
                {errors.confirmPassword.message}
              </Text>
            )}
            <Pressable
              className="bg-brown rounded-md my-2"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="px-8 py-4 text-white text-center">Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default SignUp;
