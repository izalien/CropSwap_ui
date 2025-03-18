import axios from "axios";

export async function getCrops() {
    try {
        const response = await axios.get('http://localhost:3000/api/crops/getAll');
        return response.data.data.crops;
      }
      catch (error) {
        console.error(error);
        return;
      }
}