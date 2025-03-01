import { Button, Text, View } from "react-native";
import Modal from "react-native-modal"
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { Dropdown } from "react-native-element-dropdown";

export default function MyFields() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="h-full p-10 bg bg-amber-900/75 flex items-center">
      <Text className="color-amber-50 text-7xl m-5 font-serif">My Fields</Text>
      <Modal 
        isVisible={modalVisible}
        animationIn="slideInUp"
        backdropColor={'#fef3c6'}
        backdropOpacity={0.50}
      >
        <View className="flex place-content-center h-screen items-center">
          <View className="bg-amber-100 rounded-xl shadow-md">
            <Text className="font-serif color-amber-50 text-xl bg-amber-900 rounded-t-xl p-5 font-semibold text-center mb-5">Add Field</Text>
            <View className="flex-row py-2 px-5 items-center">
              <Text className="color-amber-950 font-semibold w-20">Field Name:</Text>
              <TextInput className="bg-amber-50 h-10 border-amber-900 border-2 rounded-md p-2" placeholder="Field Name" placeholderTextColor={"#78350fbf"}/>
            </View>
            <View className="flex-row py-2 px-5 items-center">
              <Text className="color-amber-950 font-semibold w-20">Field Size:</Text>
              <TextInput className="bg-amber-50 h-10 border-amber-900 border-2 rounded-md p-2" placeholder="0" placeholderTextColor={"#78350fbf"}/>
            </View>
            <View className="flex-row py-2 px-5 items-center">
              <Text className="color-amber-950 font-semibold w-20">Location Description:</Text>
              <TextInput className="bg-amber-50 h-10 border-amber-900 border-2 rounded-md p-2" placeholder="Location" placeholderTextColor={"#78350fbf"}/>
            </View>
            <View className="flex-row py-2 px-5 items-center">
              <Text className="color-amber-950 font-semibold w-20">Crop:</Text>
              <Dropdown placeholder="Crop" placeholderStyle={{color: "#78350fbf", fontSize: 14}} style={{width: '69%', borderColor: '#78350f', borderWidth:2, padding:8, borderRadius:6, backgroundColor:'#fffbeb'}}/>
            </View>
            <View className="flex-row p-5 justify-center">
              <View className="mx-5">
                <Button title="Submit" onPress={() => {}} color={'#3c6300'}/>
              </View>
              <View className="mx-5">
                <Button title="Cancel" onPress={() => {setModalVisible(false)}} color={'#9f0712'}/>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View className="bg-amber-100 absolute inset-x-0 bottom-0 p-5 items-center">
        <View className="w-40">
          <Button title="Add Field" onPress={() => {setModalVisible(true)}} color={'#78350f'}/>
        </View>
      </View>
    </View>
  );
}
