import BaseUrl from '../../Service/BaseUrl';
import axios from 'axios';

export const getPlantList = () => {
    var getPlantListUrl = BaseUrl.BaseUrl + "bcm-protocol/cleanlinessprotocol/dashboard/plant/all";
    return axios(getPlantListUrl, {
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
}
export const saveClientShift = (object) => {
    var saveClientShiftUrl = BaseUrl.BaseUrl + "bcm-protocol/ClientShift/SaveClientShift";
    return axios(saveClientShiftUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
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
export const getAllClientShiftMaster = (plantId) => {
    var getAllClientShiftMasterUrl = BaseUrl.BaseUrl + "bcm-protocol/ClientShift/getAllClientShiftMaster?plantId=" + plantId;
    return axios(getAllClientShiftMasterUrl, {
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
}
export const shiftMasterDelete = (id) => {
    var shiftMasterDeleteUrl = BaseUrl.BaseUrl + "bcm-protocol/ClientShift/deleteClientShiftMaster/" + id;
    return axios(shiftMasterDeleteUrl, {
        method: 'DELETE',
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
}
export const employeeStatusViewData = (plantId, start, limit) => {
    var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';
    var employeeStatusViewDataUrl = BaseUrl.BaseUrl + "bcm-protocol/user/list/employeeStatusView" + param + "&start=" + start + "&limit=" + limit;
    return axios(employeeStatusViewDataUrl, {
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
}
export const workFromHome = (code) => {
    var workFromHomeUrl = BaseUrl.BaseUrl + "bcm-protocol/employee/healthtracker/workFromHome/" + code;
    return axios(workFromHomeUrl, {
        method: 'POST',
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
}
export const healthtrackerGate = (object) => {
    var healthtrackerGateUrl = BaseUrl.BaseUrl + "bcm-protocol/employee/healthtracker/gate?empSeverity=" + null;
    return axios(healthtrackerGateUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
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
export const LeaveManagementList = (object, startDate, endDate) => {
    var chuttiUrl = JSON.parse(sessionStorage.LoginUserObject).chuttiAppUrl;
    var LeaveManagementListUrl = chuttiUrl + "/core/api/v1/app-chutti/leaveReports?fromDate=" + startDate + "&toDate=" + endDate + "&start=0&limit=1000";
    return axios(LeaveManagementListUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'userTokenParam': JSON.parse(sessionStorage.chuttiLoginObject).token
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
export const getLeaveTypeList = () => {
    var orgid = JSON.parse(sessionStorage.chuttiLoginObject).data.organizationId;
    var req = { "gemsOrganisation": { "gemsOrgId": orgid }, "isActive": true };
    var chuttiUrl = JSON.parse(sessionStorage.LoginUserObject).chuttiAppUrl;
    var getLeaveTypeListUrl = chuttiUrl + "/core/api/v1/app-chutti/leavetypes?start=0&limit=100";
    return axios(getLeaveTypeListUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'userTokenParam': JSON.parse(sessionStorage.chuttiLoginObject).token
        },
        data: req,
    })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}
export const getLeaveStatus = () => {
    var orgid = JSON.parse(sessionStorage.chuttiLoginObject).data.organizationId;
    var req = { "gemsOrganisation": { "gemsOrgId": orgid }, "isActive": true };
    var chuttiUrl = JSON.parse(sessionStorage.LoginUserObject).chuttiAppUrl;
    var getLeaveTypeListUrl = chuttiUrl + "/core/api/v1/app-chutti/leavePolicy/statusList";
    return axios(getLeaveTypeListUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'userTokenParam': JSON.parse(sessionStorage.chuttiLoginObject).token
        },
        data: req,
    })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}
export const getLeaveExistsForEmployee = (empId) => {

    var date = new Date();
    var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var fullDate = [date.getFullYear(), mnth, day].join("-");
    var chuttiUrl = JSON.parse(sessionStorage.LoginUserObject).chuttiAppUrl;
    var getLeaveTypeListUrl = chuttiUrl + "/core/api/v1/app-chutti/leaveExistsForEmployee?fromDate=" + fullDate + "&toDate=" + fullDate + "&employeeId=" + empId;
    return axios(getLeaveTypeListUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'userTokenParam': JSON.parse(sessionStorage.chuttiLoginObject).token
        },
        data: {},
    })
        .then(response => response.data)
        .catch(error => {
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

export const getEmployeeDetailsByEmailId = (emailId) => {
    var chuttiUrl = JSON.parse(sessionStorage.LoginUserObject).chuttiAppUrl;
    var getEmployeeDetailsUrl = chuttiUrl + "/core/api/v1/app-chutti/loginWithEmail?UserName=" + emailId;
    return axios(getEmployeeDetailsUrl, {
        method: 'GET',
        headers: {
            'content-type': 'application/json', // whatever you want
            'userTokenParam': JSON.parse(sessionStorage.chuttiLoginObject).token
        },
    })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}
export const deleteUser = (user) => {
    var deeleteUserUrl = BaseUrl.BaseUrl + "bcm-protocol/user/saveUser";
    return axios(deeleteUserUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
        },
        data: user,
    })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}
export const getAlldepartmentList = () => {
    var departmentListUrl = BaseUrl.BaseUrl + "bcm-protocol/department/all/status?isActive=1";
    return axios(departmentListUrl, {
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
}
export const getDepartWiseDesignationList = (deptId) => {
    var getDepartWiseDesignationListUrl = BaseUrl.BaseUrl + "bcm-protocol/designation/all/department?departmentId=" + deptId;
    return axios(getDepartWiseDesignationListUrl, {
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
}
export const getAllDesignations = (deptId) => {
    var getAllDesignationsUrl = BaseUrl.BaseUrl + "bcm-protocol//designation/list/all/designation"
    return axios(getAllDesignationsUrl, {
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
}
export const saveUserObject = (userObject) => {
    var saveUserObjectUrl = BaseUrl.BaseUrl + "bcm-protocol/user/saveUser";
    return axios(saveUserObjectUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
        },
        data: userObject,
    })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}
export const getUserObject = (userID) => {
    var getUserObjectUrl = BaseUrl.BaseUrl + "bcm-protocol/user/getbyId/" + userID
    return axios(getUserObjectUrl, {
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
}
export const updateStatusToOnsite = (userId) => {
    var onsiteUrl = BaseUrl.BaseUrl + "bcm-protocol/employee/change/heathStatus/" + userId;
    return axios(onsiteUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
        },
        data: "",
    })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });

        ///
}
export const deleteAllShifts = (shifts) => {
    var onsiteUrl = BaseUrl.BaseUrl + "bcm-protocol/ClientShift/deleteAllClientShiftMaster";
    return axios(onsiteUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.loginUserToken
        },
        data: shifts,
    })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });

    }