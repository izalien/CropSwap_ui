import React from "react";
import { Text } from "react-native";

interface TitleProps {
    readonly children: React.ReactNode;
}

export default function Title({children}: TitleProps) {
    return (
        <Text className="text-amber-50 text-7xl m-16 font-serif">{children}</Text>
    );
}