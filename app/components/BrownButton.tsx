import React from "react";
import { Button, View } from "react-native";

interface LoadingModalProps {
    readonly onPress: () => void;
    readonly title: string;
}

export default function LoadingModal({ onPress, title }: LoadingModalProps) {
    return (
        <View className="w-40 mx-5">
            <Button title={title} onPress={onPress} color={'#78350f'}/>
        </View>
    );
}