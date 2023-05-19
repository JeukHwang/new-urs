export const base_url = "https://urs.kaist.ac.kr";
export const search_url = "https://urs.kaist.ac.kr/urs/rsv/sch/cmn/RsvSchCmn002M01.do";
export const resource_url = (resourceId) => `https://urs.kaist.ac.kr/urs/rsv/sch/cmn/RsvSchCmn002M01.do?prgrId=${resourceId}`;
export const reserve_resource_url = "https://urs.kaist.ac.kr/urs/rsv/app/cmn/RsvAppCmn001M03.do";
export const location_reservation_status_url = "https://urs.kaist.ac.kr/urs/rsv/app/cmn/RsvAppCmn001M11.do";
export const resource_reservation_url = "https://urs.kaist.ac.kr/urs/rsv/app/cmn/RsvAppCmn001M06.do?requestedFilePath=rsvt";
export const resource_cancel_url = "https://urs.kaist.ac.kr/urs/rsv/app/cmn/RsvAppCmn002M01_RU.do";