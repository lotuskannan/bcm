import BaseUrl from '../../Service/BaseUrl';
import axios from 'axios';
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

export const getRosterList =(SearchCode)=> {
//   var getEmployeeCodeListUrl = BaseUrl.BaseUrl+"bcm-protocol/user/"+SearchCode;
//   return axios(getEmployeeCodeListUrl, {
//     method: 'GET',
//         headers: {
//         'content-type': 'application/json', // whatever you want
//         'token':sessionStorage.loginUserToken
//         }
//     })
//     .then(response => response.data)
//     .catch(error => {
//         
//         sessionStorage.clear();
//         window.location.href = window.location.origin;
//         throw error;
//     });
};

// http://bcm-qa.cloudnowtech.com/core/api/v1/bcm-protocol/plant/getAllPlantMaster?isActive=true
// getAllPlantMaster it for get branch
export const getAllPlantMaster=()=>{
    var getAllPlantMasterUrl = BaseUrl.BaseUrl+"bcm-protocol/plant/getAllPlantMaster?isActive=true";
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
export const getPlantsBasedOnUser=()=>{
    var getAllPlantMasterUrl = BaseUrl.BaseUrl+"bcm-protocol/user/plants";
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
export const getAllClientShiftMaster=(plantId)=>{
    var getAllPlantMasterUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/getAllClientShiftMaster?plantId="+plantId;
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
export const getShiftCSVFile=()=>{
    var getShiftCSVFileUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/sampleUserCsv";
    return axios(getShiftCSVFileUrl, {
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
export const saveAssignShift=(object)=>{
    var saveAssignShiftUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/saveOrUpdateShiftLine";
    return axios(saveAssignShiftUrl, {
    method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token':sessionStorage.loginUserToken
        },
        data: object
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
}
export const assignShift=(object)=>{
    var assignShiftUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/assignShift";
    return axios(assignShiftUrl, {
    method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token':sessionStorage.loginUserToken
        },
        data: object
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
}
export const changeShift=(object)=>{
    var changeShiftUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/changeShift";
    return axios(changeShiftUrl, {
    method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token':sessionStorage.loginUserToken
        },
        data: object
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
export const getUnAssignedShiftLines=(params)=>{
    var getUnAssignedShiftLinesUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/list/unAssignedUsers"+params;
    return axios(getUnAssignedShiftLinesUrl, {
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
export const getAssignedShiftLines=(params)=>{
    var getAssignedShiftLinesUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/list/assignedUsers"+params;
    return axios(getAssignedShiftLinesUrl, {
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


export const getAllEmp=()=>{
    var getAllEmpUrl = BaseUrl.BaseUrl+"bcm-protocol/user/getAllUserMaster";
    return axios(getAllEmpUrl, {
    method: 'GET',
    cancelToken: source.token,
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

export const deleteShiftLine=(lineid)=>{
    var deleteShiftLineUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/deleteShiftLine/"+lineid;
    return axios(deleteShiftLineUrl, {
    method: 'DELETE',
    cancelToken: source.token,
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
export const fileUploadInAssignShift=(object)=>{
    var fileUploadInAssignShiftUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/userCsvUpload";
    return axios(fileUploadInAssignShiftUrl, {
    method: 'POST',
        headers: {
            'content-type': 'multipart/form-data', // whatever you want
            'token':sessionStorage.loginUserToken
        },
        data: object
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
}
export const setPushNotification = (message, userId) => {
    var req = {
        "bcmUserId": userId
    }
    var message = message;
    var setPushNotificationUrl = BaseUrl.BaseUrl + "bcm-protocol/sysalert/send/pushNotification?message=" + message;
    return axios(setPushNotificationUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
        },
        data: req,
    })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}
export const getShiftBasesOnPlant = (plantId) => {
    var getShiftBasesOnPlantUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/getAllShiftMasterByPlantId?plantId="+plantId;
    return axios(getShiftBasesOnPlantUrl, {
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