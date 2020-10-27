export class UrlConstants {
    // News and Update Endpoits
    static saveNewsUrl = '/BcmNotification/SaveNewsAndNotification';
    static getNewsListUrl = '/BcmNotification/getAllNotification';
    static getNewsByIdUrl = '/BcmNotification/';
    static getNewsListByUserIdUrl ='/BcmNotification/notification/User?User=';
    static getGroupList = '/master/group/list';
    static saveReadedNewsUrl = '/BcmNotification/notificationUserTrx/save';
    static deleteNotificationByIdUrl = '/BcmNotification/notification/delete?notificationId='

    // plant API End points
    static getDashbordPlantCountUrl = '/cleanlinessprotocol/dashboard/plant/taskstatus/count';
    static getAllPlantUrl = '/cleanlinessprotocol/dashboard/plant/all';
    static getPlantTaskByIdUrl = '/cleanlinessprotocol/dashboard/plant/tasklist/';
    static savePlantUrl = '/master/plant/save';
    static getPlantByIdUrl = '/master/plant/';
    static getTaskByIdUrl ='/cleanlinessprotocol/getTask/';
    static deleteTaskUrl = '/cleanlinessprotocol/delete/BcmPlantTask/';
    static deletePlantUrl = '/cleanlinessprotocol/delete/ClientPlantMaster/';
    static getAreaImageListUrl ='/cleanlinessprotocol/task/imageList?plantTaskId='; 

    static getAreasAndTaskUrl = '/master/areatask/combinedlist';
    static saveAssignTaskUrl = '/cleanlinessprotocol/plant/assigntask';
    static getplantAreaListByIdUrl = '/cleanlinessprotocol/dashboard/area/tasklist/';

    static getEmployeeBySearchUrl = '/user/search/userparam?name=';

    // Employee Health Url EndPoints 
    static getEmployeeHealthStatusUrl = '/employee/healthstatus';
    static getDynamciSurveyQuestionUrl = '/survey/question/list/';

    //for got password url endpoints
    static forgotPasswordUrl = '/user/forgotpassword';
    static resetPasswordUrl = '/user/updatePassword';
 
} 