import BaseUrl from '../../../Service/BaseUrl';
import axios from 'axios';

export const saveTopic = (object) => {
    var saveTopicUrl = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/course";
    return axios(saveTopicUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.token
        },
        data: object,
    })
        .then(response => response.data)
        .catch(error => {

        });
}
export const getListTopic = (payload) => {
    var getListTopicUrl = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/course/courseManagementViewList";
    return axios(getListTopicUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.token
        },
        data: payload
    })
        .then(response => response.data)
        .catch(error => {            

        });
}
export const deleteTopic = (deleteObject) => {
    var deleteObjectUrl = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/course";
    return axios(deleteObjectUrl, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json', // whatever you want
            'token': sessionStorage.token
        },
        data: deleteObject
    })
        .then(response => response.data)
        .catch(error => {            
            
        });
}
