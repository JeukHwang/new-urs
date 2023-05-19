import axios from "axios";
import dotenv from "dotenv";
import { location_reservation_status_url } from "../url.js";

dotenv.config({path: '../../.env'});


//locationId is prgrId
//searchDate format: "2023-05-19"
async function get_location_status_json(locationId, searchDate) {
    const formData1 = new URLSearchParams();
    const formData2 = new URLSearchParams();
    formData1.append("prgrId", locationId);
    formData2.append("prgrId", locationId);

    formData1.append("searchDate", searchDate);
    formData2.append("searchDate", searchDate);
    formData1.append("searchTime", "2");
    formData2.append("searchTime", "14");

    const content1 = () => axios.post(location_reservation_status_url, formData1, {
            headers: {Cookie: process.env.COOKIE}
        });
    

    const content2 = () => axios.post(location_reservation_status_url, formData2, {
            headers: {Cookie: process.env.COOKIE}
        });
    

    const [reservation_status_JSON1, reservation_status_JSON2] = await Promise.all([
        content1(), content2()
    ])

    //PRINT: debug purpose

    return [reservation_status_JSON1.data, reservation_status_JSON2.data];
}

async function parse_reservation_info(reservation_status_JSONs) {
    var reservation_infos = [];

    const reservation_status_JSON1 = reservation_status_JSONs[0];
    const reservation_status_JSON2 = reservation_status_JSONs[1];

    //Add start_time

    //PRINT: debug purpose
    // console.log(reservation_status_JSON['headList2'][0]['timeListYmd'])
    // console.log(reservation_status_JSON['headList2'][0]['timeListHh'])
    const start_date = reservation_status_JSON1['headList2'][0]['timeListYmd'];
    const start_hour = reservation_status_JSON1['headList2'][0]['timeListHh'];
    //Add end_time
    const endtime_idx = reservation_status_JSON2['headList2'].length - 1;
    
    //PRINT: debug purpose
    // console.log(reservation_status_JSON['headList2'][endtime_idx]['timeListYmd'])
    // console.log(reservation_status_JSON['headList2'][endtime_idx]['timeListHh'])
    const end_date = reservation_status_JSON2['headList2'][endtime_idx]['timeListYmd'];
    const end_hour = reservation_status_JSON2['headList2'][endtime_idx]['timeListHh'];

    const metadata = {
        start_date: start_date,
        start_hour: start_hour,
        end_date: end_date,
        end_hour: end_hour,
    };

    //iter reservation records
    const reservation_records1 = reservation_status_JSON1['bodyList'];
    const reservation_records2 = reservation_status_JSON2['bodyList'];


    for (var i = 0; i < reservation_records1.length; i++) {
        const reservation_record = reservation_records1[i];
        
        if(reservation_record['rsvtId'] != null) {
            const rss_id = reservation_record['rssId'];
            const rss_name = reservation_record['rssNm'];
            const timeline = reservation_record['timeLine'];
            const is_reserved = true;
            const reserver_name = reservation_record['rsvtAppEmplNm'];
            const reservation_id = reservation_record['rsvtId'];
            const reservation_duration = 10;

            //PRINT: debug purpose
            // console.log(rss_id);
            // console.log(rss_name);
            // console.log(timeline);
            // console.log(is_reserved);
            // console.log(reserver_name);
            // console.log(reservation_id);
            // console.log(reservation_duration);

            //create object for reservation
            reservation_infos.push({
                rss_id: rss_id,
                rss_name: rss_name,
                timeline: timeline,
                is_reserved: is_reserved,
                reserver_name: reserver_name,
                reservation_id: reservation_id,
                reservation_duration: reservation_duration,
            })
            }
    }


    for (var i = 0; i < reservation_records2.length; i++) {
        const reservation_record = reservation_records2[i];
        
        if(reservation_record['rsvtId'] != null) {
            const rss_id = reservation_record['rssId'];
            const rss_name = reservation_record['rssNm'];
            const timeline = reservation_record['timeLine'];
            const is_reserved = true;
            const reserver_name = reservation_record['rsvtAppEmplNm'];
            const reservation_id = reservation_record['rsvtId'];
            const reservation_duration = 10;

            //PRINT: debug purpose
            // console.log(rss_id);
            // console.log(rss_name);
            // console.log(timeline);
            // console.log(is_reserved);
            // console.log(reserver_name);
            // console.log(reservation_id);
            // console.log(reservation_duration);

            //create object for reservation
            reservation_infos.push({
                rss_id: rss_id,
                rss_name: rss_name,
                timeline: timeline,
                is_reserved: is_reserved,
                reserver_name: reserver_name,
                reservation_id: reservation_id,
                reservation_duration: reservation_duration,
            })
            }
    }

    //create reservation info json object
    const reservation_info_json = {
        metadata: metadata,
        reservation_infos: reservation_infos,
    };

    //PRINT: debug purpose
    //console.log(reservation_info_json);

    return reservation_info_json

}
