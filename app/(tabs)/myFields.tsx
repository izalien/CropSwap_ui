import { Button, Text, View } from "react-native";
import Modal from "react-native-modal"
import React, { useEffect, useState } from "react";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";

export default function MyFields() {
  const [newFieldModalVisible, setNewFieldModalVisible] = useState(false);
  const [existingFieldModalVisible, setExistingFieldModalVisible] = useState(false);
  const [nonCurrentFields, setNonCurrentFields] = useState(new Array<Field>());
  const [crops, setCrops] = useState(new Array<Crop>());
  const [name, setName] = useState("");
  const [size, setSize] = useState(Number);
  const [location, setLocation] = useState("");
  const [fieldCrop, setFieldCrop] = useState<Crop>();
  const [grows, setGrows] = useState(new Array<Grow>());
  const [year, setYear] = useState(Number);
  const [selectedField, setSelectedField] = useState<Field>();
  const [fields, setFields] = useState(new Array<Field>());

  const getAllCurrentGrows = async () => {
    // fetch grows from API
    try {
      const response = await axios.get('http://localhost:3000/api/grows/getAllCurrent', { params: { year } });
      setGrows(response.data.data.grows);
    }
    catch (error) {
      console.error(error);
    }
  }

  const resetValues = () => {
    // reset field values
    setName("");
    setSize(Number);
    setLocation("");
    setFieldCrop({});
  }

  const getAllFields = async () => {
    // fetch fields from API  
    try {
      const response = await axios.get('http://localhost:3000/api/fields/getAll');
      setFields(response.data.data.fields);
    }
    catch (error) {
      console.error(error);
    }
  }

  const submitNewField = async () => {
    // submit field to API
    getAllFields();
    if (fields.find(field => field.name === name)) {
      alert("A field with name already exists.");
    }
    else {
      const grow = {
        season: new Date().getFullYear(),
        field: {
          name: name, 
          size: size, 
          location: location
        },
        crop: fieldCrop
      }
      try {
        await axios.post('http://localhost:3000/api/grows/create', grow, {
          headers: {
            'Content-Type': 'application/json'
          }
        } );
        setNewFieldModalVisible(false);
      }
      catch (error) {
        console.error(error);
      } 
  
      // refresh list of fields
      resetValues();
      getAllCurrentGrows();
    }
  }

  const getAllNonCurrentFields = async () => {
    getAllFields();
    setNonCurrentFields(fields.filter((field: Field) => !grows.find(grow => grow.field.name === field.name)));
    fields.length === 0 ? alert("All existing fields are already in this season.") : setExistingFieldModalVisible(true);
  }

  useEffect(() => {
    const getAllCrops = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/crops/getAll');
        console.log(response.data.data.crops);
        setCrops([{id: null, name: "none"}, ...response.data.data.crops]);
      }
      catch (error) {
        console.error(error);
      }
    }
    setYear(new Date().getFullYear());
    getAllCurrentGrows();
    getAllCrops();
  }, []);

  return (
    <View className="h-full p-10 bg bg-amber-900/75 flex items-center">
      <Text className="color-amber-50 text-7xl m-5 font-serif">{year} Fields</Text>
      {grows.length === 0 ? (
        <Text className="color-amber-100 text-3xl">No fields found.</Text>
      ) : (
      <FlatList
        numColumns={3}
        data={grows}
        renderItem={({item}) => (
          <View className="bg-amber-100 p-5 m-5 rounded-xl">
            <Text className="color-amber-950 text-3xl font-serif font-semibold mb-2">{item.field.name.toUpperCase()}</Text>
            <View className="flex-row w-full justify-between">
              <Text className="color-amber-900 text-xl font-semibold me-5">Size:</Text>
              <Text className="color-amber-900 text-xl">{item.field.size} acres</Text>
            </View>
            <View className="flex-row w-full justify-between">
              <Text className="color-amber-900 text-xl font-semibold me-5">Location:</Text>
              <Text className="color-amber-900 text-xl">{item.field.location}</Text>
            </View>
            <View className="flex-row w-full justify-between">
              <Text className="color-amber-900 text-xl font-semibold me-5">Crop:</Text>
              <Text className="color-amber-900 text-xl">{item.crop.name}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />)}
      <View className="bg-amber-100 absolute inset-x-0 bottom-0 p-5 flex-row justify-center">
        <View className="w-40 mx-5">
          <Button title="Add Existing Field" onPress={() => {getAllNonCurrentFields()}} color={'#78350f'}/>
        </View>
        <View className="w-40 mx-5">
          <Button title="Add New Field" onPress={() => {setNewFieldModalVisible(true)}} color={'#78350f'}/>
        </View>
      </View>
      <Modal 
        isVisible={newFieldModalVisible}
        animationIn="slideInUp"
        backdropColor={'#78350f'}
        backdropOpacity={0.50}
      >
        <View className="flex place-content-center h-screen items-center">
          <View className="bg-amber-100 rounded-xl shadow-md">
            <Text className="font-serif color-amber-50 text-xl bg-amber-900 rounded-t-xl p-5 font-semibold text-center mb-5 border-amber-100 border-2">Add New Field</Text>
            <View className="flex-row py-2 px-5 items-center">
              <Text className="color-amber-950 font-semibold w-20">Field Name:</Text>
              <TextInput className="bg-amber-50 h-10 border-amber-900 border-2 rounded-md p-2" placeholder="Field Name" placeholderTextColor={"#78350fbf"} onChange={event => setName(event.nativeEvent.text)}/>
            </View>
            <View className="flex-row py-2 px-5 items-center">
              <Text className="color-amber-950 font-semibold w-20">Field Size:</Text>
              <TextInput keyboardType="numeric" className="bg-amber-50 h-10 border-amber-900 border-2 rounded-md p-2" placeholder="0" placeholderTextColor={"#78350fbf"} onChange={event => setSize(Number(event.nativeEvent.text))}/>
            </View>
            <View className="flex-row py-2 px-5 items-center">
              <Text className="color-amber-950 font-semibold w-20">Location Description:</Text>
              <TextInput className="bg-amber-50 h-10 border-amber-900 border-2 rounded-md p-2" placeholder="Location" placeholderTextColor={"#78350fbf"} onChange={event => setLocation(event.nativeEvent.text)}/>
            </View>
            <View className="flex-row py-2 px-5 items-center">
              <Text className="color-amber-950 font-semibold w-20">Crop:</Text>
              <Dropdown value={crops[0]} labelField={"name"} valueField={"id"} data={crops} placeholder="Crop" placeholderStyle={{ color: "#78350fbf", fontSize: 14 }} style={{ width: '69%', borderColor: '#78350f', borderWidth: 2, padding: 8, borderRadius: 6, backgroundColor: '#fffbeb' }} itemTextStyle={{fontSize: 14}} selectedTextStyle={{fontSize: 14}} onChange={event => setFieldCrop(event)}/>
            </View>
            <View className="flex-row p-5 justify-center">
              <View className="mx-5">
                <Button title="Submit" onPress={() => {submitNewField()}} color={'#3c6300'}/>
              </View>
              <View className="mx-5">
                <Button title="Cancel" onPress={() => {setNewFieldModalVisible(false)}} color={'#9f0712'}/>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal 
        isVisible={existingFieldModalVisible}
        animationIn="slideInUp"
        backdropColor={'#78350f'}
        backdropOpacity={0.50}
      >
        <View className="flex place-content-center h-screen items-center">
          <View className="bg-amber-100 rounded-xl shadow-md">
            <Text className="font-serif color-amber-50 text-xl bg-amber-900 rounded-t-xl p-5 font-semibold text-center mb-5 border-amber-100 border-2">Add Existing Field</Text>
            <View className="flex-row py-2 px-5 items-center">
              <Text className="color-amber-950 font-semibold w-20">Field Name:</Text>
              <Dropdown value={nonCurrentFields[0]} labelField={"name"} valueField={"id"} data={nonCurrentFields} placeholder="Field Name" placeholderStyle={{ color: "#78350fbf", fontSize: 14 }} style={{ width: '69%', borderColor: '#78350f', borderWidth: 2, padding: 8, borderRadius: 6, backgroundColor: '#fffbeb' }} itemTextStyle={{fontSize: 14}} selectedTextStyle={{fontSize: 14}} onChange={event => setSelectedField(event)}/>
            </View>
            <View className="flex-row py-2 px-5 items-center">
              <Text className="color-amber-950 font-semibold w-20">Field Size:</Text>
              <TextInput keyboardType="numeric" className="bg-amber-50 h-10 border-amber-900 border-2 rounded-md p-2" placeholder="0" placeholderTextColor={"#78350fbf"} editable={false} value={selectedField?.name}/>
            </View>
            <View className="flex-row py-2 px-5 items-center">
              <Text className="color-amber-950 font-semibold w-20">Location Description:</Text>
              <TextInput className="bg-amber-50 h-10 border-amber-900 border-2 rounded-md p-2" placeholder="Location" placeholderTextColor={"#78350fbf"}  editable={false} value={selectedField?.location}/>
            </View>
            <View className="flex-row py-2 px-5 items-center">
              <Text className="color-amber-950 font-semibold w-20">Crop:</Text>
              <Dropdown value={crops[0]} labelField={"name"} valueField={"id"} data={crops} placeholder="Crop" placeholderStyle={{ color: "#78350fbf", fontSize: 14 }} style={{ width: '69%', borderColor: '#78350f', borderWidth: 2, padding: 8, borderRadius: 6, backgroundColor: '#fffbeb' }} itemTextStyle={{fontSize: 14}} selectedTextStyle={{fontSize: 14}} onChange={event => setFieldCrop(event)}/>
            </View>
            <View className="flex-row p-5 justify-center">
              <View className="mx-5">
                <Button title="Submit" onPress={() => {}} color={'#3c6300'}/>
              </View>
              <View className="mx-5">
                <Button title="Cancel" onPress={() => {setExistingFieldModalVisible(false)}} color={'#9f0712'}/>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
