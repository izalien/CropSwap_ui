import { Button, ScrollView, Text, View } from "react-native";
import { CheckBox } from 'react-native-elements'
import Modal from "react-native-modal"
import React, { useEffect, useState } from "react";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import { getCrops } from "../utils/crops";
import LoadingModal from "../components/LoadingModal";
import BrownButton from "../components/BrownButton";
import Background from "../components/Background";
import Title from "../components/Title";
import { useGlobalSearchParams, router } from "expo-router";

export default function MyFields() {
  const [grows, setGrows] = useState(new Array<Grow>());
  const [checkedFields, setCheckedFields] = useState(new Array<boolean>());

  const { yearParam } = useGlobalSearchParams<{ yearParam: string }>();
  console.log(yearParam);
  const year = parseInt(yearParam) || new Date().getFullYear(); 
  
  const getAllCurrentGrows = async () => {
    // fetch grows from API
    try {
      const season = year || new Date().getFullYear(); 
      const response = await axios.get('http://localhost:3000/api/grows/getAllCurrent', 
        { params: { "season": season } }
      );
      setGrows(response.data.data.grows);
      setCheckedFields(new Array(response.data.data.grows.length).fill(false));
    }
    catch (error) {
      console.error(error);
    }
  }
  
  const toggleCheckbox = (index: number) => {
    const updatedCheckedFields = [...checkedFields];
    updatedCheckedFields[index] = !checkedFields[index];
    setCheckedFields(updatedCheckedFields);
  }

  const removeFields = async () => {
    let growsToRemove = new Array();
    for (let i = 0; i < checkedFields.length; i++) {
      growsToRemove = checkedFields[i] === true ? [...growsToRemove, grows[i]._id] : growsToRemove;
    }
    // send grows to remove to API
    try {
      await axios.post('http://localhost:3000/api/grows/remove', growsToRemove);
      getAllCurrentGrows();
      setShowRemove(false);
    }
    catch (error) {
      console.error(error);
    }
  }

  const [fields, setFields] = useState(new Array<Field>());

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

  const [newFieldModalVisible, setNewFieldModalVisible] = useState(false);
  const [existingFieldModalVisible, setExistingFieldModalVisible] = useState(false);
  const [nonCurrentFields, setNonCurrentFields] = useState(new Array<Field>());
  const [name, setName] = useState("");
  const [size, setSize] = useState(Number);
  const [location, setLocation] = useState("");
  const [fieldCrop, setFieldCrop] = useState({});
  
  const resetValues = () => {
    // reset field values
    setName("");
    setSize(Number);
    setLocation("");
    setFieldCrop({});
  }

  const [selectedField, setSelectedField] = useState<Field>();

  const submitNewField = async () => {
    // submit field to API
    getAllFields();
    if (fields.find(field => field.name === name)) {
      alert("A field with name already exists.");
    }
    else {
      const grow = {
        season: year,
        field: {
          name: name, 
          size: size, 
          location: location
        },
        crop: fieldCrop
      }
      try {
        await axios.post('http://localhost:3000/api/grows/createNew', grow, {
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
      getAllFields();
      resetValues();
      getAllCurrentGrows();
    }
  }

  const getAllNonCurrentFields = async () => {
    const filteredFields = fields.filter((field: Field) => !grows.find(grow => grow.field.name === field.name));
    setNonCurrentFields(filteredFields);
    filteredFields.length === 0 ? alert("All existing fields are already in this season.") : setExistingFieldModalVisible(true);
    setSelectedField(filteredFields[0]);
  }

  const submitExistingField = async () => {
    // submit existing field to API 
    const grow = {
      season: year,
      field: selectedField,
      crop: fieldCrop
    }
    try {
      await axios.post('http://localhost:3000/api/grows/createFromExisting', grow, {
        headers: {
          'Content-Type': 'application/json'
        }
      } );
      setExistingFieldModalVisible(false);
    }
    catch (error) {
      console.error(error);
    }
    
    getAllCurrentGrows();
    setExistingFieldModalVisible(false);
  }

  const [showRemove, setShowRemove] = useState(false);
  const [crops, setCrops] = useState(new Array<Crop>());
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState(new Array());
  
  useEffect(() => {
    getCrops().then((allCrops) => setCrops([{id: null, name: "none"}, ...allCrops]));

    if (year === 0) router.setParams({ year: new Date().getFullYear()});

    const getYears = () => {
      const currentYear = new Date().getFullYear();
      const tempYears = Array.from({ length: currentYear - 1900 + 1 }, (_, index) => ({
        "value": currentYear - index
      }));
      setYears(tempYears);
    }

    getYears();
    getAllFields();
    getAllCurrentGrows();
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    getAllCurrentGrows().then(() => setLoading(false));
  }, [year]);

  return (
    <ScrollView>
      <Background>
        <Title>{year} Fields</Title>
        <View className="h-full">
          <View className="flex-row h-10 align-middle">
            <Text className="color-amber-100 text-xl m-3">Select year:</Text>
            <Dropdown value={year} labelField={"value"} valueField={"value"} data={years} style={{ borderColor: '#78350f', borderWidth: 2, padding: 8, borderRadius: 6, backgroundColor: '#fffbeb'}} itemTextStyle={{fontSize: 14}} selectedTextStyle={{fontSize: 14}} onChange={(event) => router.setParams({ yearParam: event.value })}/>   
          </View>
          {showRemove && 
            <Text className="color-amber-50 text-3xl">Select fields for removal</Text>
          }
          {grows.length === 0 ? (
            <Text className="color-amber-50 text-3xl">No fields found.</Text>
          ) : (
          <FlatList
            numColumns={3}
            data={grows}
            renderItem={({item, index}) => (
              <View className="bg-amber-100 p-5 m-5 rounded-xl shadow-xl">
                <View className="flex-row items-center">
                  {showRemove && 
                    <CheckBox
                      checked={checkedFields[index]}
                      onPress={() => {toggleCheckbox(index)}}
                      iconType="material-community"
                      checkedIcon="checkbox-marked"
                      uncheckedIcon="checkbox-blank-outline"
                      checkedColor='#3c6300'
                      size={32}
                      containerStyle={{padding: 0, marginTop: 0, marginLeft: 0, marginRight: 0, paddingBottom: 3}}
                    />
                  }
                  <Text className="color-amber-950 text-3xl font-serif font-semibold mb-2">{item.field.name.toUpperCase()}</Text>
                </View>
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
            keyExtractor={(item) => item._id}
          />)}
        </View>
        {showRemove ?  
          <View className="bg-lime-900 sticky bottom-0 p-5 flex-row justify-center w-full">
            <BrownButton onPress={() => {removeFields()}} title="Remove Selected"/>
            <View className="mx-5">
              <Button title="Cancel" onPress={() => {setShowRemove(false)}} color={'#9f0712'}/>
            </View>
          </View>
          :
          <View className="bg-lime-800 sticky bottom-0 p-5 flex-row justify-center w-full">
            <View className="w-40 mx-5">
              <BrownButton title="Add Existing Field" onPress={() => {getAllNonCurrentFields()}}/>
            </View>
            <View className="w-40 mx-5">
              <BrownButton title="Add New Field" onPress={() => {setNewFieldModalVisible(true)}}/>
            </View>
            <View className="w-40 mx-5">
              <BrownButton title="Remove Field" onPress={() => setShowRemove(true)}/>
            </View>
          </View>
        }
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
                <TextInput keyboardType="numeric" className="bg-amber-50 h-10 border-amber-900 border-2 rounded-md p-2" placeholder="0" placeholderTextColor={"#78350fbf"} editable={false} value={selectedField?.size.toString()}/>
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
                  <Button title="Submit" onPress={() => {submitExistingField()}} color={'#3c6300'}/>
                </View>
                <View className="mx-5">
                  <Button title="Cancel" onPress={() => {setExistingFieldModalVisible(false)}} color={'#9f0712'}/>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <LoadingModal loading={loading} />
      </Background>
    </ScrollView>
  );
}
