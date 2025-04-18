import React, { useEffect, useState } from "react";
import { Text, View } from 'react-native';
import { getCrops } from "../utils/crops";
import axios from "axios";
import LoadingModal from "../components/LoadingModal";
import { FlatList } from "react-native-gesture-handler";
import Background from "../components/Background";
import Title from "../components/Title";

export default function CropHistory() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({headers: new Array(), data: new Array()});

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

            // get data
            let tempData = new Array();
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
            let cropTitles = new Array();
            cropNames.forEach((crop) => {
                cropTitles = cropTitles.concat("Total " + crop + " Fields", "Total " + crop + " Acres");
            });

            setData({
                headers: ["Season", ...cropTitles, "Total Fields", "Total Acreage"],
                data: tempData
            });
        }
        getData();
        setLoading(false);
    }, []);

    return(
        <Background>
            <Title>Crop History</Title>
            <View className="h-min">
                <FlatList 
                    data={data.headers}
                    horizontal={true}
                    renderItem={({item}) => ( 
                        <View className="bg-amber-900/75 backdrop-blur-sm border border-amber-950 w-32 justify-end">
                            <Text className="text-base p-2 color-amber-100">{item}</Text> 
                        </View>
                    )}
                    className="mt-12 border-t-2 border-x-2 rounded-t-2xl border-amber-950"
                />
            </View>
            <View className="h-min">
                <FlatList 
                    data={data.data}
                    renderItem={({item}) => ( 
                        <FlatList 
                            data={item}
                            horizontal={true}
                            renderItem={({item, index}) => (
                                <View>
                                    {
                                        (index % 4 === 0 || (index + 1) % 4 === 0) ?
                                            <Text className="bg-amber-100/75 backdrop-blur-sm color-amber-950 p-2 text-base w-32 text-center px-5 border border-amber-950">{item}</Text>
                                        :
                                        <Text className="bg-amber-100 color-amber-950 p-2 text-base w-32 text-center px-5 border border-amber-950">{item}</Text>
                                    }
                                </View>
                            )}
                        />
                    )}
                    className="border-b-2 border-x-2 rounded-b-2xl border-amber-950 bg-lime-900"
                />
            </View>
            <LoadingModal loading={loading}></LoadingModal>
        </Background>
    );
}