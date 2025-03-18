import React, { useEffect, useState } from "react";
import { Text, View } from 'react-native';
import { Row, Table, Rows } from 'react-native-table-component';
import { getCrops } from "../utils/crops";
import axios from "axios";
import LoadingModal from "../components/LoadingModal";

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
        <View className="h-full p-10 bg bg-amber-900/75 flex items-center">
            <Text className="color-amber-50 text-7xl m-5 font-serif">Crop History</Text>
            <Table style={{backgroundColor: '#fef3c6', width: '66%', marginTop: '2%'}}>
                <Row data={data.headers} style={{padding: '2%'}} textStyle={{fontSize: 16, color: '#461901', fontWeight: 600, textAlign: 'center', paddingHorizontal: '2%'}}/>
                <Rows data={data.data} style={{backgroundColor: '#7b3306', padding: '2%', borderColor: '#461901', borderWidth: 2}} textStyle={{color: '#fffbeb', textAlign: 'center'}}/>
            </Table>
            <LoadingModal loading={loading}></LoadingModal>
        </View>
    );
}