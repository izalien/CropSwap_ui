import { Alert, Button, Modal, Text, View } from "react-native";
import React, { useState } from "react";

export default function MyFields() {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <View className="h-full p-10 bg bg-amber-900/75 flex items-center">
      <Text className="text-amber-50 text-7xl m-5 font-serif">My Fields</Text>
      <Modal 
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View className="bg-amber-100 absolute inset-x-0 bottom-0 p-5 items-center">
          <Text>Add Field</Text>
        </View>
      </Modal>
      <View className="bg-amber-100 absolute inset-x-0 bottom-0 p-5 items-center">
        <View className="w-40">
          <Button title="Add Field" onPress={() => {setModalVisible(true)}} color={'#78350f'} />
        </View>
      </View>
    </View>
  );
}
