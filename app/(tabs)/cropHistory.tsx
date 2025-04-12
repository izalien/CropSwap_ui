import React, { useEffect, useState } from "react";
import { Text, View } from 'react-native';
import { getCrops } from "../utils/crops";
import axios from "axios";
import LoadingModal from "../components/LoadingModal";
import { FlatList } from "react-native-gesture-handler";
import Background from "../components/Background";

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
            <Text className="color-amber-50 text-7xl m-5 font-serif">Crop History</Text>
            <View className="h-min">
                <FlatList 
                    data={data.headers}
                    horizontal={true}
                    renderItem={({item}) => ( 
                        <View className="bg-amber-900 border border-amber-950 w-32 justify-end">
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
                                            <Text className="bg-amber-100/50 color-amber-950 p-2 text-base w-32 text-center px-5 border border-amber-950">{item}</Text>
                                        :
                                        <Text className="bg-amber-100 color-amber-950 p-2 text-base w-32 text-center px-5 border border-amber-950">{item}</Text>
                                    }
                                </View>
                            )}
                        />
                    )}
                    className="border-b-2 border-x-2 rounded-b-2xl border-amber-950"
                />
            </View>
            {/* <Table 
                style={{width: '66%', marginTop: '2%', borderTopLeftRadius: 15, borderTopRightRadius: 15,}} 
                borderStyle={{ borderColor: '#461901', borderWidth: 2}}
            >
                <Row 
                    data={data.headers} 
                    textStyle={{fontSize: 16, color: '#fffbeb', fontWeight: 600, paddingHorizontal: '2%', margin: 8}} 
                    style={{backgroundColor: '#7b3306', borderTopLeftRadius: 15, borderTopRightRadius: 15, borderColor: '#461901', borderWidth: 2}}
                />
                    {data.data.map((row, rowIndex) => (
                        <TableWrapper key={rowIndex} style={{flexDirection: "row"}}>
                            {row.map((cell: number, cellIndex: number) => (
                                <Cell 
                                    key={cellIndex} 
                                    data={cell} 
                                    textStyle={{color: '#461901', textAlign: 'center', fontSize: 14, margin: 5}}
                                    style={{backgroundColor: cellIndex % 4 === 0 || (cellIndex + 1) % 4 === 0 ? '#fef3c6' : '#fffbeb', width: `${1 / row.length * 100}%`}}
                                />
                            ))}
                        </TableWrapper>
                    ))}
            </Table> */}
            <LoadingModal loading={loading}></LoadingModal>
        </Background>
    );
}