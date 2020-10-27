import axios from 'axios';
import BaseUrl from '../../../Service/BaseUrl';

const getEmployeeList = (url) => {
    var apiUrl = BaseUrl.BaseUrl + `bcm-protocol/healthtrackerreport/${url}`;
    return axios(apiUrl, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'token': sessionStorage.loginUserToken // whatever you want
        },
    })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};

const getDepartmentList = (plantId) => {
    var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';
    var apiUrl = BaseUrl.BaseUrl + `bcm-protocol/healthtrackerreport/departments` + param;
    return axios(apiUrl, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'token': sessionStorage.loginUserToken // whatever you want
        },
    })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};

const downloadReport = (url) => {
    var plantId=0
    var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';
    var apiUrl = BaseUrl.BaseUrl + `bcm-protocol/healthtrackerreport/departments` + param;
    return axios(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'token': sessionStorage.loginUserToken // whatever you want
        },
    })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};

export const EmployeeHealthReportService = {
    getEmployeeList, getDepartmentList , downloadReport
}

