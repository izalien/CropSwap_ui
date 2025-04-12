import React from "react";
import { ImageBackground, View } from "react-native";

interface BackgroundProps {
    readonly children: React.ReactNode;
}

export default function Background({children}: BackgroundProps) {
    return (
        <ImageBackground source={require("../../assets/images/background.jpeg")} resizeMode="stretch">
            <View className="h-screen bg-cover bg-center items-center bg-lime-900/75">
                {children}
            </View>
        </ImageBackground>
    );
}