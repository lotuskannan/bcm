
import BaseUrl from '../../Service/BaseUrl';
import axios from 'axios';
// const CancelToken = axios.CancelToken;
// const source = CancelToken.source();

export const downloadShiftReportPDF=(params)=>{
    var downloadShiftReportPDFURL = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/shiftReportPDFexport"+params;
    return axios(downloadShiftReportPDFURL, {
    method: 'GET',
        headers: {
        'content-type': 'application/json',
        'token':sessionStorage.loginUserToken
        }
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
}

export const downloadShiftReportCSV=(params)=>{
    var downloadShiftReportCSVURL = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/shiftReportCsvDownload"+params;
    return axios(downloadShiftReportCSVURL, {
    method: 'GET',
        headers: {
        'content-type': 'application/json',
        'token':sessionStorage.loginUserToken
        }
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
}

export const getAllShiftReport=(params)=>{
    var getAllShiftReportUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/shiftManagementReportView"+params;
    return axios(getAllShiftReportUrl, {
    method: 'GET',
        headers: {
        'content-type': 'application/json',
        'token':sessionStorage.loginUserToken
        }
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
}



export const getAllShiftLine=()=>{
    var getAllShiftLineUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/list/cntShiftLine";
    return axios(getAllShiftLineUrl, {
    method: 'GET',
        headers: {
        'content-type': 'application/json', // whatever you want
        'token':sessionStorage.loginUserToken
        }
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
}

export const getAllClientShiftMaster=()=>{
    var getAllPlantMasterUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/getAllClientShiftMaster?isActive=1";
    return axios(getAllPlantMasterUrl, {
    method: 'GET',
        headers: {
        'content-type': 'application/json', // whatever you want
        'token':sessionStorage.loginUserToken
        }
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
}

export const getAllUserMaster=()=>{
    
    var getAllDesignationUrl = BaseUrl.BaseUrl+"bcm-protocol/user/getAllUserMaster?isActive=1";
    return axios(getAllDesignationUrl, {
    method: 'GET',
        headers: {
        'content-type': 'application/json', // whatever you want
        'token':sessionStorage.loginUserToken
        }
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
}
