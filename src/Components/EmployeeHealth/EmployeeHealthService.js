import BaseUrl from '../../Service/BaseUrl';
import axios from 'axios';

export const empHistoryRecord=(empId)=> {
  var empHistoryRecordUrl = BaseUrl.BaseUrl+"bcm-protocol/employee/healthrecord/showdetail/"+empId;  
  return axios(empHistoryRecordUrl, {
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
};

export const empHealthDirectoryList=(mappingUrl)=> {
  var empHealthDirectoryListUrl = BaseUrl.BaseUrl+"bcm-protocol/employee/healthstatus/range/?"+mappingUrl;  
  return axios(empHealthDirectoryListUrl, {
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
};

export const getUserDetails =(userId)=> {
  var getUserDetailsUrl = BaseUrl.BaseUrl+"bcm-protocol/user/getbyId/"+userId;
  return axios(getUserDetailsUrl, {
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
};

export const submitDailySurvey = (healthCheckUpData) => {
  var healthCheckUpDataReqUrl = BaseUrl.BaseUrl + "bcm-protocol/employee/healthsurvey/submit";
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