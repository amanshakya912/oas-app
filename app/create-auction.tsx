import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from "react-native";
import React, { useState } from "react";
import StepIndicator from "react-native-step-indicator";
import { Controller, useForm } from "react-hook-form";
import ModalSelector from "react-native-modal-selector";
import { CreateAuctionFormInputs } from "@/types";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Api from "@/utils/Api";
import Toast from "react-native-toast-message";
import axios from "axios";
import { ActivityIndicator } from "react-native";

interface Props {
  value?: string;
  onChange: (date: string) => void;
}
const customStyles = {
  stepIndicatorSize: 35,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#A27B5C",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#A27B5C",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#A27B5C",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#A27B5C",
  stepIndicatorUnFinishedColor: "#aaaaaa",
  stepIndicatorCurrentColor: "#A27B5C",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#ffffff",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#000000",
  labelColor: "#999999",
  labelSize: 11,
  currentStepLabelColor: "#A27B5C",
};

const labels = [
  "Category",
  "Product Details",
  "Product Specifications",
  "Price Prediction",
  "Auction Details",
];
const CreateAuction = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CreateAuctionFormInputs>({
    defaultValues: {
      category: "",
      quantity: 1,
      auctionStartTime: new Date().toISOString(),
      auctionEndTime: new Date().toISOString(),
    },
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValue1, setSelectedValue1] = useState("");
  const [selectedValue2, setSelectedValue2] = useState("");
  const [selectedValue3, setSelectedValue3] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productDetail, setProductDetail] = useState();
  const [productDetailId, setProductDetailId] = useState<string>();
  const [priceRange, setPriceRange] = useState<number>();
  const [product, setProduct] = useState();
  const nextStep = async () => {
    if (currentStep == 3) {
      console.log("3", currentStep);
      loading ? "" : setCurrentStep((prevCurrentStep) => prevCurrentStep + 1);
    } else if (currentStep === labels.length - 1) {
      onSubmit();
      setCurrentStep((prevCurrentStep) => prevCurrentStep + 1);
    } else {
      const isValid = await trigger();
      if (isValid) {
        setCurrentStep((prevCurrentStep) => prevCurrentStep + 1);
        console.log("cs", currentStep);

        if (currentStep == 2) {
          console.log("2", currentStep);
          await handleSubmitForProductSpecifications();
        }
      }
    }
  };

  // Function to move to previous step
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const data = [
    { key: "1", label: "Select a Category", value: "" },
    { key: "2", label: "Mobile", value: "mobile" },
  ];
  const blueData = [
    { key: "1", label: "Yes", value: 0 },
    { key: "2", label: "No", value: 1 },
  ];
  const dualData = [
    { key: "1", label: "Yes", value: 0 },
    { key: "2", label: "No", value: 1 },
  ];
  const wifiData = [
    { key: "1", label: "Yes", value: 0 },
    { key: "2", label: "No", value: 1 },
  ];
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUris = result.assets.map((asset) => asset.uri);
      console.log("heko", imageUris);
      setSelectedImages((prev) => [...prev, ...imageUris]);
      setValue("images", [...(watch("images") || []), ...imageUris]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    setValue("images", updatedImages);
  };

  const handleDateChange =
    (field: "auctionStartTime" | "auctionEndTime") =>
    (selectedDate?: Date) => {
      // field === 'auctionEndTime' ? (
      //   setShowEndDatePicker(true),
      //   setShowStartDatePicker(false)
      // ) : (
      setShowEndDatePicker(false), setShowStartDatePicker(false);
      // )

      if (!selectedDate) return; // Ensure selectedDate is valid

      const currentTime = new Date(watch(field) || new Date()); // Fallback to today if empty
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(
        currentTime.getHours(),
        currentTime.getMinutes(),
        currentTime.getSeconds()
      );
      setValue(field, updatedDate.toISOString());
    };

  // Handle Time Change
  const handleTimeChange =
    (field: "auctionStartTime" | "auctionEndTime") =>
    ( selectedTime?: Date) => {
      // field === 'auctionEndTime' ? (
      //   setShowEndTimePicker(true),
      //   setShowStartTimePicker(false)
      // ) : (
      setShowEndTimePicker(false), setShowStartTimePicker(false);
      // )
      if (selectedTime) {
        const currentDate = new Date(watch(field));
        currentDate.setHours(
          selectedTime.getHours(),
          selectedTime.getMinutes(),
          selectedTime.getSeconds()
        );
        setValue(field, currentDate.toISOString());
      }
    };

  const onSubmit = () => {
    const finalData = getValues();
    console.log("Form completed!", finalData);
    handleFormSubmit(finalData);
  };
  const uriToBlob = async (fileUri: string) => {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    return new File([blob], "mbl.png", { type: "image/png" }); // Convert to File
  };

  const handleSubmitForProductSpecifications = async () => {
    setLoading(true);
    // const productSpecs = [getValues('battery_power'),getValues('blue'),getValues('clock_speed'),getValues('dual_sim'),getValues('fc'),getValues('four_g'),getValues('int_memory'),getValues('m_dep'),getValues('mobile_wt'),getValues('n_cores'),getValues('pc'),getValues('px_height'),getValues('px_width'),getValues('ram'),getValues('sc_h'),getValues('sc_w'),getValues('talk_time'),getValues('three_g'),getValues('touch_screen'),getValues('wifi')]
    const productSpecs = [
      getValues("battery_power"),
      getValues("blue"),
      getValues("dual_sim"),
      getValues("fc"),
      getValues("int_memory"),
      getValues("ram"),
      getValues("wifi"),
      getValues("pc"),
      getValues("n_cores"),
      getValues("px_height"),
      getValues("px_width"),
    ];
    console.log(productSpecs);
    const features = productSpecs.map((item) =>
      typeof item === "string" ? parseFloat(item) : item
    );
    console.log("nm", features);
    try {
      const res = await Api.addProductDetail(features);
      console.log(res);
      setProductDetail(res.productDetail);
      setProductDetailId(res.productDetail._id);
      setPriceRange(res.productDetail.price_range);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFormSubmit = async (data: CreateAuctionFormInputs) => {
    console.log("data", data);
    const formData = new FormData();

    Object.entries({
      category: data.category,
      quantity: data.quantity,
      auctionStartTime: data.auctionStartTime,
      auctionEndTime: data.auctionEndTime,
      name: data.name,
      description: data.description,
      startingPrice: data.startingPrice,
      buyNowPrice: data.buyNowPrice,
      bidIncrement: data.bidIncrement,
      productDetailId: productDetailId ? productDetailId : "",
    }).forEach(([key, value]) => {
      if (typeof value === "number") {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value);
      }
    });
    if (Array.isArray(data.images)) {
      for (const fileUri of data.images) {
        formData.append("images", {
          uri: fileUri,
          name: `image-${Date.now()}.jpg`,
          type: "image/jpeg",
        } as any);
      }
    }
    

    console.log("da", formData);
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await Api.addProduct(formData);
      console.log("res", res);
      setProduct(res.data);
      Toast.show({ type: "success", text1: res.message });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          Toast.show({
            type: "error",
            text1: error.response.data.message,
          });
        } else if (error.response) {
          Toast.show({
            type: "error",
            text1: `Error ${error.response.status}: ${error.response.statusText}`,
          });
        } else {
          Toast.show({
            type: "error",
            text1: `Network error. Please try again.`,
          });
        }
      } else {
        console.log(error);
        Toast.show({
          type: "error",
          text1: `An unexpected error occurred. Please try again.`,
        });
      }
    }
  };

  return (
    <View className="bg-black flex-1">
      <View className="bg-light-dark h-1/4 rounded-br-[100px] items-center justify-center">
        <Text className="text-white font-lora text-2xl">Create Auction</Text>
      </View>
      <ScrollView className="px-4 mt-5">
        <View className="flex-1  bg-light-dark rounded-3xl p-4">
          <StepIndicator
            customStyles={customStyles}
            currentPosition={currentStep}
            // labels={labels}
            stepCount={5}
          />
          {currentStep === 0 && (
            <View className="mt-4">
              <Text className="font-lora text-center text-white text-xl">
                Category
              </Text>
              <Text className="text-white text-center font-lora mb-4 mt-2">
                Select a category for your product
              </Text>
              <Controller
                control={control}
                rules={{
                  required: "Category is required",
                }}
                name="category"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Category <Text className="text-red-500">*</Text>
                    </Text>
                    <ModalSelector
                      data={data}
                      cancelText={"Cancel"}
                      optionContainerStyle={{
                        backgroundColor: "#A27B5C",
                      }}
                      optionTextStyle={{
                        color: "#ffffff",
                      }}
                      cancelStyle={{
                        backgroundColor: "#A27B5C",
                        marginTop: 10,
                      }}
                      cancelTextStyle={{
                        color: "#ffffff",
                      }}
                      onChange={(option) => {
                        setSelectedValue(option.label); // Update local state
                        setValue("category", option.value); // Update form value
                      }}
                    >
                      <TextInput
                        value={selectedValue}
                        placeholder="Select a Category"
                        editable={false}
                        className="w-full text-white bg-brown p-4 rounded-md capitalize placeholder:text-white"
                      />
                    </ModalSelector>
                  </View>
                )}
              />
              {errors.category && (
                <Text className="text-red-500 mb-2">
                  {errors.category.message}
                </Text>
              )}
            </View>
          )}
          {currentStep === 1 && (
            <View className="mt-4">
              <Text className="font-lora text-center text-white text-xl">
                Product Details
              </Text>
              <Text className="text-white text-center font-lora mb-4 mt-2">
                Provide Your Product Details
              </Text>
              <Controller
                control={control}
                rules={{
                  required: "Product Name is required",
                }}
                name="name"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Product Name <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <TextInput
                        placeholder="Enter the name of your product"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.name && (
                <Text className="text-red-500 mb-2">{errors.name.message}</Text>
              )}
              <Controller
                control={control}
                // rules={{
                //   required: "Product Name is required",
                // }}
                name="description"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Description<Text className="text-red-500"></Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <TextInput
                        placeholder="Enter the description for your product"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        className="flex-1 text-black"
                        multiline={true}
                        numberOfLines={4}
                      />
                    </View>
                  </View>
                )}
              />
              <Controller
                control={control}
                rules={{
                  required: "At least one image of the product is required",
                }}
                name="images"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Images <Text className="text-red-500">*</Text>
                    </Text>
                    <TouchableOpacity
                      onPress={pickImage}
                      className="w-full bg-[#A27B5C] border-0 text-white py-2 px-3 rounded-lg"
                    >
                      <Text className="text-center text-white">
                        Select Images
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.images && (
                <Text className="text-red-500 mb-2">
                  {errors.images.message}
                </Text>
              )}
              {selectedImages.length > 0 && (
                <View className="flex-row flex-wrap gap-2 mt-3">
                  {selectedImages.map((uri, index) => (
                    <View key={index} className="relative">
                      <Image
                        source={{ uri }}
                        className="w-20 h-20 object-cover rounded-lg shadow mb-2"
                      />
                      <TouchableOpacity
                        onPress={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full flex items-center justify-center"
                      >
                        <Text className="text-white font-bold">×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Quantity is required",
                  min: {
                    value: 1,
                    message: "Qantity should be at least 1",
                  },
                }}
                name="quantity"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Quantity <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <TextInput
                        placeholder="Enter the name of your product"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ? value.toString() : ""}
                        keyboardType="numeric"
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.quantity && (
                <Text className="text-red-500 mb-2">
                  {errors.quantity.message}
                </Text>
              )}
            </View>
          )}
          {currentStep === 2 && (
            <View className="mt-4">
              <Text className="font-lora text-center text-white text-xl">
                Product Specifications
              </Text>
              <Text className="text-white text-center font-lora mb-4 mt-2">
                Provide The Product Specifications
              </Text>
              <Controller
                control={control}
                rules={{
                  required: "Battery Power is required",
                }}
                name="battery_power"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Battery Power (mAh)<Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <TextInput
                        placeholder="Battery Power (mAh)"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ? value.toString() : ""}
                        keyboardType="numeric"
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.battery_power && (
                <Text className="text-red-500 mb-2">
                  {errors.battery_power.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Bluetooth is required",
                }}
                name="blue"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Bluetooth <Text className="text-red-500">*</Text>
                    </Text>
                    <ModalSelector
                      data={blueData}
                      cancelText={"Cancel"}
                      optionContainerStyle={{
                        backgroundColor: "#A27B5C",
                      }}
                      optionTextStyle={{
                        color: "#ffffff",
                      }}
                      cancelStyle={{
                        backgroundColor: "#A27B5C",
                        marginTop: 10,
                      }}
                      cancelTextStyle={{
                        color: "#ffffff",
                      }}
                      onChange={(option) => {
                        setSelectedValue1(option.label); // Update local state
                        setValue("blue", option.value); // Update form value
                      }}
                    >
                      <TextInput
                        value={selectedValue1}
                        placeholder="Bluetooth"
                        editable={false}
                        className="w-full text-white bg-brown p-4 rounded-md capitalize placeholder:text-white"
                      />
                    </ModalSelector>
                  </View>
                )}
              />
              {errors.blue && (
                <Text className="text-red-500 mb-2">{errors.blue.message}</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Dual Sim is required",
                }}
                name="dual_sim"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Dual Sim <Text className="text-red-500">*</Text>
                    </Text>
                    <ModalSelector
                      data={dualData}
                      cancelText={"Cancel"}
                      optionContainerStyle={{
                        backgroundColor: "#A27B5C",
                      }}
                      optionTextStyle={{
                        color: "#ffffff",
                      }}
                      cancelStyle={{
                        backgroundColor: "#A27B5C",
                        marginTop: 10,
                      }}
                      cancelTextStyle={{
                        color: "#ffffff",
                      }}
                      onChange={(option) => {
                        setSelectedValue2(option.label); // Update local state
                        setValue("dual_sim", option.value); // Update form value
                      }}
                    >
                      <TextInput
                        value={selectedValue2}
                        placeholder="Dual Sim"
                        editable={false}
                        className="w-full text-white bg-brown p-4 rounded-md capitalize placeholder:text-white"
                      />
                    </ModalSelector>
                  </View>
                )}
              />
              {errors.dual_sim && (
                <Text className="text-red-500 mb-2">
                  {errors.dual_sim.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Front Camera (Mega Pixels) is required",
                }}
                name="fc"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Front Camera (Mega Pixels)
                      <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <TextInput
                        placeholder="Front Camera (Mega Pixels)"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ? value.toString() : ""}
                        keyboardType="numeric"
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.fc && (
                <Text className="text-red-500 mb-2">{errors.fc.message}</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Internal Memory is required",
                }}
                name="int_memory"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Internal Memory (GB)
                      <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <TextInput
                        placeholder="Internal Memory (GB)"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ? value.toString() : ""}
                        keyboardType="numeric"
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.int_memory && (
                <Text className="text-red-500 mb-2">
                  {errors.int_memory.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "RAM is required",
                }}
                name="ram"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      RAM (MB)<Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <TextInput
                        placeholder="RAM (MB)"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ? value.toString() : ""}
                        keyboardType="numeric"
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.ram && (
                <Text className="text-red-500 mb-2">{errors.ram.message}</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "WiFi Support is required",
                }}
                name="wifi"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      WiFi Support <Text className="text-red-500">*</Text>
                    </Text>
                    <ModalSelector
                      data={wifiData}
                      cancelText={"Cancel"}
                      optionContainerStyle={{
                        backgroundColor: "#A27B5C",
                      }}
                      optionTextStyle={{
                        color: "#ffffff",
                      }}
                      cancelStyle={{
                        backgroundColor: "#A27B5C",
                        marginTop: 10,
                      }}
                      cancelTextStyle={{
                        color: "#ffffff",
                      }}
                      onChange={(option) => {
                        setSelectedValue3(option.label); // Update local state
                        setValue("wifi", option.value); // Update form value
                      }}
                    >
                      <TextInput
                        value={selectedValue3}
                        placeholder="WiFi Support"
                        editable={false}
                        className="w-full text-white bg-brown p-4 rounded-md capitalize placeholder:text-white"
                      />
                    </ModalSelector>
                  </View>
                )}
              />
              {errors.wifi && (
                <Text className="text-red-500 mb-2">{errors.wifi.message}</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Primary Camera (Mega Pixels) is required",
                }}
                name="pc"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Primary Camera (Mega Pixels)
                      <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <TextInput
                        placeholder="Primary Camera (Mega Pixels)"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ? value.toString() : ""}
                        keyboardType="numeric"
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.pc && (
                <Text className="text-red-500 mb-2">{errors.pc.message}</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Number of Cores of processor is required",
                }}
                name="n_cores"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Number of Cores of processor
                      <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <TextInput
                        placeholder="Number of Cores of processor"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ? value.toString() : ""}
                        keyboardType="numeric"
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.n_cores && (
                <Text className="text-red-500 mb-2">
                  {errors.n_cores.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Pixel Resolution Height is required",
                }}
                name="px_height"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Pixel Resolution Height
                      <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <TextInput
                        placeholder="Pixel Resolution Height"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ? value.toString() : ""}
                        keyboardType="numeric"
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.px_height && (
                <Text className="text-red-500 mb-2">
                  {errors.px_height.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Pixel Resolution Width is required",
                }}
                name="px_width"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Pixel Resolution Width
                      <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <TextInput
                        placeholder="Pixel Resolution Width"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ? value.toString() : ""}
                        keyboardType="numeric"
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.px_width && (
                <Text className="text-red-500 mb-2">
                  {errors.px_width.message}
                </Text>
              )}
            </View>
          )}
          {currentStep === 3 && (
            <View className="mt-4">
              <Text className="font-lora text-center text-white text-xl">
                Price Prediction
              </Text>
              {loading ? (
                <>
                  <Text className="text-white text-center font-lora mb-4 mt-2">
                    Please wait, your Product Specifications are being analyzed
                    and price range is being predicted!!
                  </Text>
                  <View className="py-4">
                    <ActivityIndicator size="large" color="#A27B5C" />
                  </View>
                </>
              ) : (
                <>
                  <Text className="text-white text-center font-lora mb-4 mt-2">
                    Your price range has been predicted as, Rs.
                    {(() => {
                      switch (priceRange) {
                        case 0:
                          return "5000-15000";
                        case 1:
                          return "15000-25000";
                        case 2:
                          return "25000-50000";
                        case 3:
                          return "50000+";
                        default:
                          return "Invalid price range";
                      }
                    })()}
                  </Text>
                  <Text className="text-white text-center font-lora mb-4 mt-2">
                    You can proceed to the next step!
                  </Text>
                </>
              )}
            </View>
          )}
          {currentStep === 4 && (
            <View className="mt-4">
              <Text className="font-lora text-center text-white text-xl">
                Auction Details
              </Text>
              <Text className="text-white text-center font-lora mb-4 mt-2">
                Provide The Auction Details
              </Text>
              <Controller
                control={control}
                rules={{
                  required: "Starting Price is required",
                  min: {
                    value: 1,
                    message: "Starting Price should be greater than 0",
                  },
                }}
                name="startingPrice"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Starting Price <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <View className="flex-row items-center gap-2">
                        <Text>Rs.</Text>
                      </View>
                      <TextInput
                        placeholder="Enter the starting price for your product"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        value={value}
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.startingPrice && (
                <Text className="text-red-500 mb-2">
                  {errors.startingPrice.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Buy Now Price is required",
                  min: {
                    value: watch("startingPrice"),
                    message:
                      "Buy Now Price should be greater than starting price",
                  },
                }}
                name="buyNowPrice"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Buy Now Price <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <View className="flex-row items-center gap-2">
                        <Text>Rs.</Text>
                      </View>
                      <TextInput
                        placeholder="Enter the buy now price for your product"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        value={value}
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.buyNowPrice && (
                <Text className="text-red-500 mb-2">
                  {errors.buyNowPrice.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Bid Increment is required",
                  min: {
                    value: 1,
                    message: "Bid Increment should be greater 0",
                  },
                }}
                name="bidIncrement"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="gap-2 mb-4">
                    <Text className="text-white">
                      Bid Increment <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="w-full bg-white p-3 rounded-lg relative flex-row items-center gap-4">
                      <View className="flex-row items-center gap-2">
                        <Text>Rs.</Text>
                      </View>
                      <TextInput
                        placeholder="Enter the Bid Increment for your product"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        value={value}
                        className="flex-1 text-black"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.bidIncrement && (
                <Text className="text-red-500 mb-2">
                  {errors.bidIncrement.message}
                </Text>
              )}
              <Controller
                control={control}
                name="auctionStartTime"
                rules={{ required: "Auction start time is required" }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <Text className="text-white">
                      Auction Start Time <Text className="text-red-500">*</Text>
                    </Text>
                    {/* Date Picker */}
                    <View className="mt-2 mb-4">
                      <TouchableOpacity
                        onPress={() => setShowStartDatePicker(true)}
                      >
                        <Text className="text-white bg-brown p-2 rounded-lg text-center">
                          Select Date:{" "}
                          {value
                            ? new Date(value).toLocaleDateString()
                            : new Date().toLocaleDateString()}
                        </Text>
                      </TouchableOpacity>

                      {showStartDatePicker && (
                        <DateTimePicker
                          value={new Date(value)}
                          mode="date"
                          display="default"
                          onChange={handleDateChange("auctionStartTime")}
                        />
                      )}

                      {/* Time Picker */}
                      <TouchableOpacity
                        onPress={() => setShowStartTimePicker(true)}
                        className="mt-2"
                      >
                        <Text className="text-white bg-brown p-2 rounded-lg text-center">
                          Select Time:{" "}
                          {value
                            ? new Date(value).toLocaleTimeString()
                            : new Date().toLocaleTimeString()}
                        </Text>
                      </TouchableOpacity>

                      {showStartTimePicker && (
                        <DateTimePicker
                          value={new Date(value)}
                          mode="time"
                          display="default"
                          onChange={handleTimeChange("auctionStartTime")}
                        />
                      )}
                    </View>
                    {errors.auctionStartTime && (
                      <Text className="text-red-500 mt-2">
                        {errors.auctionStartTime.message}
                      </Text>
                    )}
                  </>
                )}
              />
              <Controller
                control={control}
                name="auctionEndTime"
                rules={{
                  required: "Auction End time is required",
                  validate: (endTime) => {
                    const startTime = watch("auctionStartTime");
                    if (!startTime)
                      return "Please select the auction start time first.";
                    if (new Date(endTime) <= new Date(startTime)) {
                      return "Auction End time must be greater than Auction Start time.";
                    }
                    return true;
                  },
                }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <Text className="text-white">
                      Auction End Time <Text className="text-red-500">*</Text>
                    </Text>
                    {/* Date Picker */}
                    <View className="mt-2 mb-4">
                      <TouchableOpacity
                        onPress={() => setShowEndDatePicker(true)}
                      >
                        <Text className="text-white bg-brown p-2 rounded-lg text-center">
                          Select Date:{" "}
                          {value
                            ? new Date(value).toLocaleDateString()
                            : new Date().toLocaleDateString()}
                        </Text>
                      </TouchableOpacity>

                      {showEndDatePicker && (
                        <DateTimePicker
                          value={new Date(value)}
                          mode="date"
                          display="default"
                          onChange={handleDateChange("auctionEndTime")}
                        />
                      )}

                      {/* Time Picker */}
                      <TouchableOpacity
                        onPress={() => setShowEndTimePicker(true)}
                        className="mt-2"
                      >
                        <Text className="text-white bg-brown p-2 rounded-lg text-center">
                          Select Time:{" "}
                          {value
                            ? new Date(value).toLocaleTimeString()
                            : new Date().toLocaleTimeString()}
                        </Text>
                      </TouchableOpacity>

                      {showEndTimePicker && (
                        <DateTimePicker
                          value={new Date(value)}
                          mode="time"
                          display="default"
                          onChange={handleTimeChange("auctionEndTime")}
                        />
                      )}
                      {errors.auctionEndTime && (
                        <Text className="text-red-500 mt-2">
                          {errors.auctionEndTime.message}
                        </Text>
                      )}
                    </View>
                  </>
                )}
              />
            </View>
          )}
          <View>
            <View className="flex-row-reverse justify-between">
              {currentStep < 4 ? (
                <TouchableOpacity
                  onPress={nextStep}
                  className="px-6 py-2 text-white text-center bg-brown rounded-md"
                >
                  <Text className="text-white">Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  className="px-6 py-2 text-white text-center bg-brown rounded-md"
                >
                  <Text className="text-white">Submit</Text>
                </TouchableOpacity>
              )}
              {currentStep > 0 && (
                <TouchableOpacity
                  onPress={prevStep}
                  className="px-6 py-2 text-white text-center bg-brown rounded-md"
                >
                  <Text className="text-white">Back</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateAuction;
