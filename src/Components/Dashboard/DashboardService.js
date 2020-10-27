import BaseUrl from '../../Service/BaseUrl';
import axios from 'axios';

// axios.interceptors.response.use(response => response, error => {
//   debugger;
//   console.log('interceptors',JSON.stringify(error));
//   if (error.response.status === 401)
//     return error;
// });

export const getDashboardObject = (plantId) => {
  var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';
  var loginUrl = BaseUrl.BaseUrl + "bcm-protocol/employee/healthstatus/dashboard/count" + param;
  return axios(loginUrl, {
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

export const getPlantList = (plantId) => {
  var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';
  var loginUrl = BaseUrl.BaseUrl + "bcm-protocol/cleanlinessprotocol/dashboard/plant/taskstatus/count" + param;
  return axios(loginUrl, {
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

export const dailyHealthRecordCount = (plantId) => {
  var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';

  var dailyHealthRecordCountUrl = BaseUrl.BaseUrl + "bcm-protocol/employee/dashboard/employees/dailyHealthRecordCount" + param;
  return axios(dailyHealthRecordCountUrl, {
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
export const allLeaveTypeCounts = () => {
  var date = new Date();
  var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var fullDate = [date.getFullYear(), mnth, day].join("-");
  var organisationId = JSON.parse(sessionStorage.chuttiLoginObject).data.organizationId;
  var chuttiUrl = JSON.parse(sessionStorage.LoginUserObject).chuttiAppUrl;
  var allLeaveTypeCountsUrl = chuttiUrl + "/core/api/v1/app-chutti/allLeaveTypeCounts?";
  allLeaveTypeCountsUrl = allLeaveTypeCountsUrl + "organisationId=" + organisationId + "&fromDate=" + fullDate + "&toDate=" + fullDate;
  return axios(allLeaveTypeCountsUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json', // whatever you want
      'userTokenParam': JSON.parse(sessionStorage.chuttiLoginObject).token
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
export const employeeStatistics = () => {
  var organisationId = JSON.parse(sessionStorage.chuttiLoginObject).data.organizationId;
  var chuttiUrl = JSON.parse(sessionStorage.LoginUserObject).chuttiAppUrl;
  // https://qa-chutti.cloudnowtech.net/core/api/v1/app-chutti/employeeStatistics?orgId=562&start=2020-01-12&end=2020-01-18
  var current = new Date();
  var future = new Date(); // get today date
  future.setDate(future.getDate() - 6); // add 7 days
  var finalDate = future.getFullYear() + '-' + ((future.getMonth() + 1) < 10 ? '0' : '') + (future.getMonth() + 1) + '-' + future.getDate();
  var currentDate = current.getFullYear() + '-' + ((current.getMonth() + 1) < 10 ? '0' : '') + (current.getMonth() + 1) + '-' + current.getDate();
  var startWeekDate = currentDate;
  var endWeekDate = finalDate;

  var employeeStatisticsUrl = chuttiUrl + "/core/api/v1/app-chutti/employeeStatistics?";
  employeeStatisticsUrl = employeeStatisticsUrl + "&start=" + endWeekDate + "&end=" + startWeekDate;
  return axios(employeeStatisticsUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json', // whatever you want
      'userTokenParam': JSON.parse(sessionStorage.chuttiLoginObject).token
    },
    data: {
      "organisationId": organisationId
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

export const Surveydetails = (plantId) => {
  var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';

  var SurveyUrl = BaseUrl.BaseUrl + "bcm-protocol/survey/question/dashboard/employees/dailyWFHSurveyCount" + param;
  return axios(SurveyUrl, {
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
export const healthtrackerScancount = (plantId) => {
  var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';
  var healthtrackerScancountUrl = BaseUrl.BaseUrl + "bcm-protocol/employee/healthtracker/scancount" + param;
  return axios(healthtrackerScancountUrl, {
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
export const elmsGetCourseList = (orgId) => {
  var elmsGetCourseListUrl = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/category/bcmAdminGraphAnalytics?organisationId=" + orgId;
  return axios(elmsGetCourseListUrl, {
    method: 'GET',
    headers: {
      'content-type': 'application/json', // whatever you want
      'token': sessionStorage.token
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
export const workFromHomeAndOnSiteCount = (plantId) => {
  var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';
  var workFromHomeAndOnSiteCountUrl = BaseUrl.BaseUrl + "bcm-protocol/employee/healthtracker/workFromHomeAndOnSiteCount" + param;
  return axios(workFromHomeAndOnSiteCountUrl, {
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

export const getDashboardDetails = (plantId) => {
  var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';
  var workFromHomeAndOnSiteCountUrl = BaseUrl.BaseUrl + "bcm-protocol/user/dashboard" + param;
  return axios(workFromHomeAndOnSiteCountUrl, {
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