import axios from "axios";
import BaseUrl from '../../Service/BaseUrl';

const axiosInstance = axios.create({
  baseURL: BaseUrl.BaseUrl
})

// You can do the same with `request interceptor`
axiosInstance.interceptors.response.use(
  response => {
    // intercept response...
    return response
  },
  error => {
      debugger;
    // intercept errors
    return Promise.reject(error)
  }
)
// You can create/export more then one
export { axiosInstance }