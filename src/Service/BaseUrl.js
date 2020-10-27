import environment from '../environments/environment';
const url = JSON.stringify(environment);
export default class BaseUrl {
     
    static BaseUrl = JSON.parse(url).baseUrl;
    
    // static BaseUrl = 'http://35.244.6.109/core/api/v1/'; // SuperFil India  Live
    // static BaseUrl = 'https://pre-prod.merit.cloudnowtech.com/core/api/v1/';  // merit Pre-Production 
    // static BaseUrl = 'https://testing.merit.cloudnowtech.com/core/api/v1/';  // merit Pre-Production 
    // static BaseUrl = 'https://development.merit.cloudnowtech.com/core/api/v1/';  //  merit development 

    static demoElmsHornbillfxUrl = 'https://elms.meritgroup.cloudnowtech.com/core/api/v1/';
    static demoElmsHornbillfxUrl1 = 'https://demo.elms.hornbillfx.com/core/api/v1/';
}