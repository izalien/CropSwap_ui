import React from "react";
import { ImageBackground, ScrollView} from "react-native";

interface BackgroundProps {
    readonly children: React.ReactNode;
}

export default function Background({children}: BackgroundProps) {
    return (
        <ImageBackground source={require("../../assets/images/background.jpeg")} resizeMode="stretch" className="h-full">
            <ScrollView className="bg-cover bg-center bg-lime-900/75" contentContainerClassName="h-full w-full items-center">
                {children}
            </ScrollView>
        </ImageBackground>
    );
}