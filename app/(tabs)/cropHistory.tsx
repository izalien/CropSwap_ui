import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native';
import { getCrops } from "../utils/crops";
import axios from "axios";
import LoadingModal from "../components/LoadingModal";
import { FlatList } from "react-native-gesture-handler";
import Background from "../components/Background";
import Title from "../components/Title";
import { Link } from "expo-router";

export default function CropHistory() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(new Array());

    useEffect(() => {

        const getCropTotals = (grows: Grow[], season: number, crop: string) => {
            const results = grows.filter((grow: Grow) => grow.season === season && grow.crop.name === crop.toLowerCase());
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

    const getCellContentClassNames = (rowOne?: number) => {
        if (rowOne === 0)
            return `text-base color-amber-100 justify-end`;
        return `color-amber-950 text-center`;
    }

    const getCellContainerClassNames = (index: number, view?: boolean, rowOne?: number) => {
        let classes = index === data[0].length - 1 ? `p-2 w-1/${data[0].length} min-w-[90px]` : `p-2 border-r-2 border-amber-950 w-1/${data[0].length} min-w-[90px]`;
        if (rowOne === 0)
            return `${classes} justify-end`;
        else if ((index % 4 === 0 || (index + 1) % 4 === 0) && view) 
            return `${classes} bg-amber-100/50 hover:bg-lime-100/75 backdrop-blur-sm px-5 border-t-2 underline`;
        else if (index % 4 === 0 || (index + 1) % 4 === 0)
            return `${classes} bg-amber-100/50 backdrop-blur-sm px-5 border-t-2`;
        else if (view)
            return `${classes} bg-amber-100 hover:bg-lime-100/75 px-5 border-t-2`;
        return `${classes} bg-amber-100 px-5 border-t-2`;
    }

    return(
        <Background>
            <Title>Crop History</Title>
            <View className="h-min w-2/3">
                <FlatList
                    data={data}
                    horizontal={true}
                    contentContainerStyle={{ flexDirection: 'column' }}
                    renderItem={({item, index}) => (
                            <View key={index} className="flex-row w-min">
                                {item.map((cell: any, cellIndex: number) => (
                                    <View key={cellIndex} className={getCellContainerClassNames(cellIndex, false, index)}>
                                        <Text className={getCellContentClassNames(index)}>{cell}</Text>
                                    </View>
                                ))}
                                {index != 0 &&
                                    <View className={getCellContainerClassNames(item.length, true)}>
                                        <Link className={getCellContentClassNames()} href={`/(tabs)/myFields?yearParam=${item[0]}`}>View</Link>
                                    </View>
                                }
                            </View>
                    )}
                    className="rounded-xl bg-amber-900 shadow-xl"
                />
            </View>
            <LoadingModal loading={loading}></LoadingModal>
        </Background>
    );
}