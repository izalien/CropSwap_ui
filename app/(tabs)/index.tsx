import {Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from '@react-navigation/native';
import Background from "../components/Background";
import Title from "../components/Title";

export default function Index() {
  const navigation = useNavigation();
  return (
    <Background>
        <View className="backdrop-blur-sm flex items-center justify-center p-20 rounded-xl">
          <Title>Welcome to CropSwap</Title>
          <Text className="text-amber-100 text-5xl m-5 font-serif">manage your crops' past, present, and future</Text>
        </View>
        <View className="flex-row w-full justify-center">
          <TouchableOpacity className="bg-amber-900/75 backdrop-blur-sm p-10 w-1/5 m-20 items-center rounded-xl" onPress={() => navigation.navigate("cropHistory")}>
            <Text className="color-amber-100 text-2xl font-semibold">Crop History</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-amber-900/75 backdrop-blur-sm p-10 w-1/5 m-20 items-center rounded-xl" onPress={() => navigation.navigate("myFields")}>
            <Text className="color-amber-100 text-2xl font-semibold">My Fields</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-amber-900/75 backdrop-blur-sm p-10 w-1/5 m-20 items-center rounded-xl">
            <Text className="color-amber-100 text-2xl font-semibold">Crop Planning</Text>
          </TouchableOpacity>
        </View>
      </Background>
  );
}
