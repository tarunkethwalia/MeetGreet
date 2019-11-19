import axios from "axios";
import env from "../environment"

//For Sid- change {env.ApiLink} to {env.url}
const userURL = `${env.ApiLink}user/`;

class userService {

   static login = (user) => {
        return axios.post(`${userURL}login`, user);
    };


   static register = (user) => {
        return axios.post(`${userURL}register`, user);
    };
}

export default userService;