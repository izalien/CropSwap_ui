import React from "react";
import { Button, View } from "react-native";

interface BrowButtonProps {
    readonly onPress: () => void;
    readonly title: string;
    readonly className?: string;
}

export default function LoadingModal({ onPress, title, className }: BrowButtonProps) {
    return (
        <View className={className ? "w-40 mx-5 " + className : "w-40 mx-5"}>
            <Button title={title} onPress={onPress} color={'#78350f'}/>
        </View>
    );
}