import axios from "axios";
import dotenv from "dotenv";
import {resource_cancel_url} from './url.js'
import FormData from "form-data";

dotenv.config({path: '../../.env'});


const cancel_Reservation = async (reservationId, locationId) => {
    const formData = new FormData();
    formData.append("rsvtAwtDivCd", "A00401");
    formData.append("rsvtPrcsDivCd", "A012080010");
    formData.append("sRsvtAwtDivCd", "A00401");
    formData.append("prgrId", locationId);
    formData.append("rsvtId", reservationId);

    const content = await axios.post(resource_cancel_url, formData, {
        headers: {Cookie: process.env.COOKIE}
    })

    const html = content.data
    console.log(content.data)
    return 
}

await cancel_Reservation("003440231", "0000000482")

export default cancel_Reservation