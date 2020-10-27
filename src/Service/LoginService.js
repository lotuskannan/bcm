import BaseUrl from './BaseUrl';
import axios from 'axios';

const login = payload => {
  var loginUrl = BaseUrl.BaseUrl + "bcm-protocol/user/login";
  //   method: 'POST/GET',
  return axios(loginUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json', // whatever you want
    },
    data: payload,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

const post = (url,payload) => {
  var loginUrl = BaseUrl.BaseUrl + `bcm-protocol${url}`;
  return axios(loginUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json', // whatever you want
    },
    data: payload,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

const chuttiLoginWithEmail=(id)=> {
  
  var chuttiLoginWithEmailUrl = "https://qa-chutti.cloudnowtech.net/core/api/v1/app-chutti/loginWithEmail?UserName="+id;
  //   method: 'POST/GET',
  return axios(chuttiLoginWithEmailUrl, {
    method: 'GET',
    headers: {
      'content-type': 'application/json', // whatever you want
    }
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};
const googleSignIn = payload => {
  var signInUrl = BaseUrl.BaseUrl + "bcm-protocol/user/login/google";
  //   method: 'POST/GET',
  return axios(signInUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json', // whatever you want
    },
    data: payload,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const LoginService = {
  login,post,chuttiLoginWithEmail,googleSignIn
}
