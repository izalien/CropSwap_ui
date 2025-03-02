import { Button, Text, View } from "react-native";
import Modal from "react-native-modal"
import React, { useEffect, useState } from "react";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";

export default function MyFields() {
  const [modalVisible, setModalVisible] = useState(false);
  const [fields, setFields] = useState(new Array<Field>());

  useEffect(() => {
    // fetch fields from API
    const getAllFields = async () => {
      try {
        const response = await axios.get('http://localhost:3000/fields/getAll');
        setFields(response.data.data.fields);
        console.log(response.data.data.fields);
        console.log("length", response.data.data.fields.length);
      }
      catch (error) {
        console.error(error);
      }
    }
    getAllFields();
  }, []);

  return (
    <View className="h-full p-10 bg bg-amber-900/75 flex items-center">
      <Text className="color-amber-50 text-7xl m-5 font-serif">My Fields</Text>
      {fields.length === 0 ? (
        <Text className="color-amber-100 text-3xl">No fields found.</Text>
      ) : (
      <FlatList
        data={fields}
        renderItem={({item}) => (
          <View className="bg-amber-100 p-5 m-5 rounded-xl">
            <Text className="color-amber-900 text-3xl font-serif">{item.name}</Text>
            <Text className="color-amber-900 text-xl font-serif">Size: {item.size} acres</Text>
            <Text className="color-amber-900 text-xl font-serif">Location: {item.location}</Text>
            <Text className="color-amber-900 text-xl font-serif">Crop: {item.crop}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />)}
      <View className="bg-amber-100 absolute inset-x-0 bottom-0 p-5 items-center">
        <View className="w-40">
          <Button title="Add Field" onPress={() => {setModalVisible(true)}} color={'#78350f'}/>
        </View>
      </View>
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
    </View>
  );
}
