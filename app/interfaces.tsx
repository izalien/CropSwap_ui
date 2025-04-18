interface Field {
    id: string;
    name: string; 
    size: number;
    location: string;
}

interface Crop {
    id: string;
    name: string;
    maxSeasons: number;
}

interface Grow {
    _id: string;
    season: number;
    field: Field;
    crop: Crop;
}