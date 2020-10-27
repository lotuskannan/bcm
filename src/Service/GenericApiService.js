import axios from 'axios';
import BaseUrl from './BaseUrl';

const post = (apiUrl,payload) => {
    var url = BaseUrl.BaseUrl + `bcm-protocol${apiUrl}`;
    return axios(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token':sessionStorage.loginUserToken
        },
        data: payload,
    })
        .then(response => response.data)
        .catch(error => {
            // localStorage.clear();
            // sessionStorage.clear();
            // window.location.href = window.location.origin;
            throw error;
        });
};

const getAll = (apiUrl) => {
    var url = BaseUrl.BaseUrl + `bcm-protocol${apiUrl}`;
    return axios(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token':sessionStorage.loginUserToken
        }
    })
        .then(response => response.data)
        .catch(error => {
            // localStorage.clear();
            // sessionStorage.clear();
            // window.location.href = window.location.origin;
            throw error;
        });
};

const deleteById = (apiUrl) => {
    var url = BaseUrl.BaseUrl + `bcm-protocol${apiUrl}`;
    return axios(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token':sessionStorage.loginUserToken
        }
    })
        .then(response => response.data)
        .catch(error => {
            // localStorage.clear();
            // sessionStorage.clear();
            // window.location.href = window.location.origin;
            throw error;
        });
};

const saveFormData = (apiUrl , payload) =>{
    var url = BaseUrl.BaseUrl + `bcm-protocol${apiUrl}`;
    
    return axios(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'token':sessionStorage.loginUserToken
        },
        data: payload,
    })
        .then(response => response.data)
        .catch(error => {
            // localStorage.clear();
            // sessionStorage.clear();
            // window.location.href = window.location.origin;
            throw error;
        });
}

export const GenericApiService ={
    post ,getAll ,saveFormData,deleteById
}
