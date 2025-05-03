import React, { useEffect, useState } from "react";
import { Text, View } from 'react-native';
import { getCrops } from "../utils/crops";
import axios from "axios";
import LoadingModal from "../components/LoadingModal";
import { FlatList } from "react-native-gesture-handler";
import Background from "../components/Background";
import Title from "../components/Title";
import { Link } from "expo-router";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function CropHistory() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(new Array());

    useEffect(() => {

        const getCropTotals = (grows: Grow[], season: number, crop: string) => {
            const results = grows.filter((grow: Grow) => { return grow.season === season && grow.crop.name === crop.toLowerCase();});
            let acres = 0; 
            results.forEach((result) => acres += result.field.size);
            return [results.length, acres];
        }

        const getData = async () => {
            // get crops
            const crops = await getCrops() || [];
            let cropNames = new Array();
            crops.forEach((crop: Crop) => cropNames = cropNames.concat(crop.name.charAt(0).toUpperCase() + crop.name.slice(1)));

            // get all grows
            const response = await axios.get('http://localhost:3000/api/grows/getAll');
            const grows = response.data.data.grows;

            // get all seasons
            let seasons = new Array();
            grows.forEach((grow: Grow) => seasons = seasons.includes(grow.season) ? seasons : seasons.concat(grow.season));

            // get headers
            let cropTitles = new Array();
            cropNames.forEach((crop) => {
                cropTitles = cropTitles.concat("Total " + crop + " Fields", "Total " + crop + " Acres");
            });
            let tempData = [["Season", ...cropTitles, "Total Fields", "Total Acreage", ""]];

            // get data
            seasons.forEach((season) => {
                // get crop totals
                let cropTotals = new Array();
                cropNames.forEach((crop) => {
                    cropTotals = cropTotals.concat(getCropTotals(grows, season, crop));
                });

                // get total fields
                const results = grows.filter((grow: Grow) => season === grow.season);
                const totalFields = results.length;
                let totalAcres = 0;
                results.forEach((result: Grow) => totalAcres += result.field.size);

                // set data
                tempData = [...tempData, [
                    season,
                    ...cropTotals,
                    totalFields,
                    totalAcres
                ]];
            });

            // set table crop headers

            setData(tempData);
        }
        getData();
        setLoading(false);
    }, []);

    const getCellClassNames = (index: number, view?: boolean, rowOne?: number) => {
        let classes = index === data[0].length - 1 ? `p-2 text-base w-1/${data[0].length}` : `p-2 text-base w-1/${data[0].length} border-r-2 border-amber-950`;
        if (rowOne === 0)
            return `${classes} color-amber-100 justify-end`
        else if ((index % 4 === 0 || (index + 1) % 4 === 0) && view) 
            return `${classes} bg-amber-100/50 hover:bg-lime-100/75 backdrop-blur-sm color-amber-950 text-center px-5 border-t-2 underline`;
        else if (index % 4 === 0 || (index + 1) % 4 === 0)
            return `${classes} bg-amber-100/50 backdrop-blur-sm color-amber-950 text-center px-5 border-t-2`;
        else if (view)
            return `${classes} bg-amber-100 hover:bg-lime-100/75 color-amber-950 text-center px-5 border-t-2`;
        return `${classes} bg-amber-100 color-amber-950 text-center px-5 border-t-2`;
    }

    return(
        <Background>
            <Title>Crop History</Title>
            <View className="h-min w-2/3">
                <FlatList
                    data={data}
                    renderItem={({item, index}) => (
                            <View key={index} className="flex-row">
                                {item.map((cell: any, cellIndex: number) => (
                                    <View key={cellIndex} className={getCellClassNames(cellIndex, false, index)}>{cell}</View>
                                ))}
                                {index != 0 &&
                                    <View className={getCellClassNames(item.length, true)}>
                                        <Link href={{ pathname: '/(tabs)/myFields?yearProp=2024'}}>View</Link>
                                    </View>
                                }
                            </View>
                    )}
                    className="rounded-xl bg-amber-900 shadow-xl"
                />
            </View>
            {/* <View className="h-min w-2/3">
                <FlatList 
                    data={data.headers}
                    horizontal={true}
                    renderItem={({item}) => ( 
                        <View className="bg-amber-900/75 backdrop-blur-sm border border-amber-950 justify-end">
                            <Text className="text-base p-2 color-amber-100">{item}</Text> 
                        </View>
                    )}
                    className="mt-12 border-t-2 border-x-2 rounded-t-2xl border-amber-950"
                />
            </View> */}
            {/* <View className="h-min w-2/3">
                <FlatList 
                    data={data.data}
                    renderItem={({item}) => ( 
                        <FlatList 
                            data={[...item]}
                            horizontal={true}
                            renderItem={({item, index}) => (
                                <View>
                                    {
                                        // if last column add view link
                                        (index === data.headers.length - 2) ?
                                            <View className="inline-block">
                                                <Text className={getClassNames(index)}>{item}</Text>
                                                <Link href={{ pathname: '/(tabs)/myFields?yearProp=2024'}} className={getClassNames(index + 1, true)}>View</Link>
                                            </View>
                                        :
                                        <Text className={getClassNames(index)}>{item}</Text>
                                    }
                                </View>
                            )}
                        />
                    )}
                    className="border-b-2 border-x-2 rounded-b-2xl border-amber-950"
                />
            </View> */}
            <LoadingModal loading={loading}></LoadingModal>
        </Background>
    );
}