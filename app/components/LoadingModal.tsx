import React from "react";
import { ActivityIndicator, View } from "react-native";
import Modal from "react-native-modal";

export default function LoadingModal(props: Readonly<{ loading: boolean; }>) {
    return (
        <Modal 
          isVisible={props.loading}
          animationIn="slideInUp"
          backdropColor={'#78350f'}
          backdropOpacity={0.50}
        >
          <View className="flex place-content-center h-screen items-center">
            <ActivityIndicator size="large" color="#fef3c6" />
          </View>
        </Modal>
    );
}