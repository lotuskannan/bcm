import BaseUrl from '../../Service/BaseUrl';
import axios from 'axios';

export const getSocialDistanceList=()=> {
    var SocialDistanceUrl = BaseUrl.BaseUrl+"bcm-protocol/socialdistance/list";
    return axios(SocialDistanceUrl, {
        method: 'GET',
            headers: {
            'content-type': 'application/json', // whatever you want
            'token':sessionStorage.loginUserToken
            }
        })
        .then(response => response.data)
        .catch(error => {
            throw error;
    });
};
  