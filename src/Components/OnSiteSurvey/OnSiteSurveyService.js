import BaseUrl from '../../Service/BaseUrl';
import axios from 'axios';

export const getEmployeeCodeList = (SearchCode) => {
    var plantId = sessionStorage.plantId ? sessionStorage.plantId : 0;
    var getEmployeeCodeListUrl = BaseUrl.BaseUrl + "bcm-protocol/user/" + SearchCode + "?clientPlantMasterId=" + plantId;
    return axios(getEmployeeCodeListUrl, {
        method: 'GET',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
        }
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
};
export const getEmployeeCodeListNew = (SearchCode) => {
    var plantId = sessionStorage.plantId ? sessionStorage.plantId : 0;
    var getEmployeeCodeListUrl = BaseUrl.BaseUrl + "bcm-protocol/user/security/" + SearchCode + "?clientPlantMasterId=" + plantId;
    return axios(getEmployeeCodeListUrl, {
        method: 'GET',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
        }
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
};

export const getUserDetails = (userId) => {
    var getUserDetailsUrl = BaseUrl.BaseUrl + "bcm-protocol/user/getbyId/" + userId;
    return axios(getUserDetailsUrl, {
        method: 'GET',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
        }
    })
    .then(response => response.data)
    .catch(error => {            
        throw error;
    });
};
export const submitEntryHealthCheckDetails = (healthCheckUpData) => {
    var plantId = sessionStorage.plantId ? sessionStorage.plantId : 0;
    var healthCheckUpDataReqUrl = BaseUrl.BaseUrl + "bcm-protocol/employee/healthtracker/gate?clientPlantMasterId="+plantId;;
    return axios(healthCheckUpDataReqUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
        },
        data: healthCheckUpData,
    })
        .then(response => response.data)
        .catch(error => {
            // 
            // sessionStorage.clear();
            // window.location.href = window.location.origin;
            throw error;
        });
};
export const getScancount =()=> {
    var plantId = sessionStorage.plantId ? sessionStorage.plantId : 0;
    var getScancountUrl = BaseUrl.BaseUrl+"bcm-protocol/employee/healthtracker/scancount?clientPlantMasterId="+plantId;
    return axios(getScancountUrl, {
        method: 'GET',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
        }
    })
        .then(response => response.data)
        .catch(error => {
            // 
            // sessionStorage.clear();
            // window.location.href = window.location.origin;
            throw error;
        });
};
export const getEmpStatusUserCodeWise = (UserCode) => {
    var UserCodeUrl = BaseUrl.BaseUrl + "bcm-protocol/user/search/userparam?employeeCode=" + UserCode;
    return axios(UserCodeUrl, {
        method: 'GET',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
        }
    })
        .then(response => response.data)
        .catch(error => {
            // 
            // sessionStorage.clear();
            // window.location.href = window.location.origin;
            throw error;
        });
};