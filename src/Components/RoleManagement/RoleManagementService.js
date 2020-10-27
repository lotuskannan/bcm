import BaseUrl from '../../Service/BaseUrl';
import axios from 'axios';

export const saveUserGroup=(object)=>{
    var saveUserGroupUrl = BaseUrl.BaseUrl+"bcm-protocol/userGroup/saveUserGroup";
    return axios(saveUserGroupUrl, {
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
export const appPermissionList=()=>{
    var appPermissionListUrl = BaseUrl.BaseUrl+"bcm-protocol/userGroup/list/AppPermission";
    return axios(appPermissionListUrl, {
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
export const getAllUserGroupListByIdAndName=()=>{
    var getAllUserGroupListByIdAndNameUrl = BaseUrl.BaseUrl+"bcm-protocol/userGroup/getAllUserGroupListByIdAndName";
    return axios(getAllUserGroupListByIdAndNameUrl, {
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
export const getAllUserGroupViewList=()=>{
    var getAllUserGroupViewListUrl = BaseUrl.BaseUrl+"bcm-protocol/userGroup/getAllUserGroupViewList";
    return axios(getAllUserGroupViewListUrl, {
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
export const getUserPermissionBesedOnGroupId=(GroupId)=>{
    var getUserPermissionBesedOnGroupIdUrl = BaseUrl.BaseUrl+"bcm-protocol/userGroup/getByUserGroupId?userGroupId="+GroupId;
    return axios(getUserPermissionBesedOnGroupIdUrl, {
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
export const deleteUserGroup=(GroupId)=>{
    var deleteUserGroupUrl = BaseUrl.BaseUrl+"bcm-protocol/userGroup/deleteUserGroup?userGroupId="+GroupId;
    return axios(deleteUserGroupUrl, {
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