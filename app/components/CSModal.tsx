import React from "react";
import { View, Text, Button} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Modal from "react-native-modal"

interface CSModalProps {
    readonly isVisible: boolean;
    readonly crops: Array<Crop>;
    readonly submit: () => void;
    readonly cancel: (visible: boolean) => void;
    readonly header: string;
    readonly children: React.ReactNode;
    readonly setFieldCrop: (event: any) => void;
}

export default function CSModal({ isVisible, crops, submit, cancel, header, children, setFieldCrop }: CSModalProps) {
    return (
        <Modal
            isVisible={isVisible}
            animationIn="slideInUp"
            // amber-100
            backdropColor="#fef3c6"
            backdropOpacity={0.5}
        >
            <View className="flex place-content-center h-screen items-center">
                <View className="bg-amber-100 rounded-xl shadow-md mb-5 border-lime-950 border-2">
                    <Text className="font-serif color-amber-50 text-xl bg-amber-900 p-5 font-semibold text-center rounded-t-lg">{header}</Text>
                    {children}
                    <View className="flex-row py-2 px-5 items-center">
                        <Text className="color-amber-950 font-semibold w-20">Crop:</Text>
                        <Dropdown value={crops[0]} labelField={"name"} valueField={"id"} data={crops} placeholder="Crop" placeholderStyle={{ color: "#78350fbf", fontSize: 14 }} style={{ width: '69%', borderColor: '#78350f', borderWidth: 2, padding: 8, borderRadius: 6, backgroundColor: '#fffbeb' }} itemTextStyle={{ fontSize: 14 }} selectedTextStyle={{ fontSize: 14 }} onChange={event => setFieldCrop(event)} />
                    </View>
                    <View className="flex-row p-5 justify-center">
                        <View className="mx-5">
                            <Button title="Submit" onPress={() => { submit() }} color={'#3c6300'} />
                        </View>
                        <View className="mx-5">
                            <Button title="Cancel" onPress={() => { cancel(false) }} color={'#9f0712'} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}