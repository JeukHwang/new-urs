import axios from "axios";
import dotenv from "dotenv";
import { parse } from 'node-html-parser';
import {reserve_resource_url, resource_reservation_url} from './url.js'
import FormData from "form-data";

dotenv.config({path: '../../.env'});

const isReservationSuccessful = async (html) => {
    const reservationSuccess = await html.querySelector("#subWrap > div.sub_rightArea > div.comp").innerText.includes("예약번호로 신청 되었습니다.");
    if (reservationSuccess) {
        const reservation_number = await html.querySelector("#subWrap > div.sub_rightArea > div.comp > p:nth-child(2) > span.blue").innerText;
        return reservation_number; 
    } else {
        return null;
    }
}


const reserve_Location  = async (locationId, resourceId, start_date, end_date, start_time, end_time) => {
    const formData = new FormData();
    formData.append("prgrId", "0000000482");
    formData.append("rssId", "0000001401");
    formData.append("prgrAttAgrYn", "Y");
    formData.append("rptRsvtDivCd", "A00201");
    formData.append("rsvtStDt", "2023-05-23");
    formData.append("rsvtEdDt", "2023-05-23");
    formData.append("rsvtStTmHh", "11");
    formData.append("rsvtEdTmHh", "12");

    console.log(resource_reservation_url)
    console.log(formData.getHeaders())


    const content = await axios.post(resource_reservation_url, formData, {
        headers: {Cookie: process.env.COOKIE}
    })

    const html = content.data
    console.log(content.data)

    //TODO: check if reservation is successful: 
    //if so, return reservation id 
    //else, return null
    const root = parse(html);



    //check content of classname comp 
    const reservation_status = await isReservationSuccessful(root);

    if (reservation_status) {
        console.log("reservation success: ", reservation_status)
        return reservation_status;
    } else {
        console.log("reservation failed")
        return null;
    }
}
