import BaseUrl from '../../Service/BaseUrl';
import axios from 'axios';

export const getPlantList =()=> {
    var getPlantListUrl = BaseUrl.BaseUrl+"bcm-protocol/cleanlinessprotocol/dashboard/plant/all";
    return axios(getPlantListUrl, {
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
export const saveClientShift=(object)=>{
    var saveClientShiftUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/SaveClientShift";
    return axios(saveClientShiftUrl, {
        method: 'POST',
        headers: {
        'content-type': 'application/json', // whatever you want
        'token':sessionStorage.loginUserToken
        },
        data: object,
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
    var getAllClientShiftMasterUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/getAllClientShiftMaster?isActive=1";
    return axios(getAllClientShiftMasterUrl, {
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
export const shiftMasterDelete=(id)=>{
    var shiftMasterDeleteUrl = BaseUrl.BaseUrl+"bcm-protocol/ClientShift/deleteClientShiftMaster/"+id;
    return axios(shiftMasterDeleteUrl, {
        method: 'DELETE',
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
export const employeeStatusViewData=()=>{
    var employeeStatusViewDataUrl = BaseUrl.BaseUrl+"bcm-protocol/user/list/employeeStatusView";
    return axios(employeeStatusViewDataUrl, {
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
export const workFromHome=(code)=>{
    var workFromHomeUrl = BaseUrl.BaseUrl+"bcm-protocol/employee/healthtracker/workFromHome/"+code;
    return axios(workFromHomeUrl, {
        method: 'POST',
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
export const healthtrackerGate=(object)=>{
    var healthtrackerGateUrl = BaseUrl.BaseUrl+"bcm-protocol/employee/healthtracker/gate?empSeverity="+null;
    return axios(healthtrackerGateUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token':sessionStorage.loginUserToken
        },
        data: object,
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
}
export const LeaveManagementList=(object,startDate,endDate)=>{
    var chuttiUrl = JSON.parse(sessionStorage.LoginUserObject).chuttiAppUrl;
    var LeaveManagementListUrl = chuttiUrl+"/core/api/v1/app-chutti/leaveReports?fromDate="+startDate+"&toDate="+endDate+"&start=0&limit=1000";
    return axios(LeaveManagementListUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'userTokenParam':JSON.parse(sessionStorage.chuttiLoginObject).token
        },
        data: object,
    })
    .then(response => response.data)
    .catch(error => {
        // 
        // sessionStorage.clear();
        // window.location.href = window.location.origin;
        throw error;
    });
}
export const getLeaveTypeList=()=>{
    var orgid = JSON.parse(sessionStorage.chuttiLoginObject).data.organizationId;
    var req = {"gemsOrganisation":{"gemsOrgId":orgid},"isActive":true};
    var chuttiUrl = JSON.parse(sessionStorage.LoginUserObject).chuttiAppUrl;
    var getLeaveTypeListUrl = chuttiUrl+"/core/api/v1/app-chutti/leavetypes?start=0&limit=100";
    return axios(getLeaveTypeListUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'userTokenParam':JSON.parse(sessionStorage.chuttiLoginObject).token
        },
        data: req,
    })
    .then(response => response.data)
    .catch(error => {       
        throw error;
    });
}
export const getLeaveStatus=()=>{
    var orgid = JSON.parse(sessionStorage.chuttiLoginObject).data.organizationId;
    var req = {"gemsOrganisation":{"gemsOrgId":orgid},"isActive":true};
    var chuttiUrl = JSON.parse(sessionStorage.LoginUserObject).chuttiAppUrl;
    var getLeaveTypeListUrl = chuttiUrl+"/core/api/v1/app-chutti/leavePolicy/statusList";
    return axios(getLeaveTypeListUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'userTokenParam':JSON.parse(sessionStorage.chuttiLoginObject).token
        },
        data: req,
    })
    .then(response => response.data)
    .catch(error => {       
        throw error;
    });
}
export const getLeaveExistsForEmployee=()=>{
    var orgid = JSON.parse(sessionStorage.chuttiLoginObject).data.organizationId;
    var req = {"gemsOrganisation":{"gemsOrgId":orgid},"isActive":true};
    var date = new Date();
    var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var fullDate = [date.getFullYear(), mnth, day].join("-");
    var empId = JSON.parse(sessionStorage.chuttiLoginObject).data.employeeId;
    var chuttiUrl = JSON.parse(sessionStorage.LoginUserObject).chuttiAppUrl;
    var getLeaveTypeListUrl = chuttiUrl+"/core/api/v1/app-chutti/leaveExistsForEmployee?fromDate="+fullDate+"&toDate="+fullDate+"&employeeId="+empId;
    return axios(getLeaveTypeListUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'userTokenParam':JSON.parse(sessionStorage.chuttiLoginObject).token
        },
        data: req,
    })
    .then(response => response.data)
    .catch(error => {       
        throw error;
    });
}
export const setPushNotification=(message)=>{
    var orgid = JSON.parse(sessionStorage.chuttiLoginObject).data.organizationId;
    var req = {
        "bcmUserId" : JSON.parse(sessionStorage.LoginUserObject).bcmUserId
    }
    var message = message;
    var setPushNotificationUrl =  BaseUrl.BaseUrl+"bcm-protocol/sysalert/send/pushNotification?message="+message;
    return axios(setPushNotificationUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'userTokenParam':JSON.parse(sessionStorage.chuttiLoginObject).token
        },
        data: req,
    })
    .then(response => response.data)
    .catch(error => {       
        throw error;
    });
}