import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from '@react-navigation/native';

export default function Index() {
  const navigation = useNavigation();
  return (
    <ImageBackground source={require("../../assets/images/background.jpeg")} resizeMode="stretch" className="h-screen">
      <View className="h-screen p-10 bg-cover bg-center items-center">
        <View className="bg-amber-900/75 backdrop-blur-sm flex items-center justify-center p-20 rounded-xl">
          <Text className="text-amber-50 text-7xl m-5 font-serif">Welcome to CropSwap</Text>
          <Text className="text-amber-100 text-5xl m-5 font-serif">manage your crops' past, present, and future</Text>
        </View>
        <View className="flex-row w-full justify-center">
          <TouchableOpacity className="bg-amber-900/75 backdrop-blur-sm p-10 w-1/5 m-20 items-center rounded-xl">
            <Text className="color-amber-100 text-2xl font-semibold">Crop History</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-amber-900/75 backdrop-blur-sm p-10 w-1/5 m-20 items-center rounded-xl" onPress={() => navigation.navigate("myFields")}>
            <Text className="color-amber-100 text-2xl font-semibold">Current Fields</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-amber-900/75 backdrop-blur-sm p-10 w-1/5 m-20 items-center rounded-xl">
            <Text className="color-amber-100 text-2xl font-semibold">Crop Planning</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
