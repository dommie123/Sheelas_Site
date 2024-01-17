import axios from "axios";
import { determineBackendURL } from "../AppConfig";

const authPostRequest = (endpoint, body, token) => {
    return axios.post(`${determineBackendURL()}/${endpoint}`, body, { headers: {
        "Authorization": `jwt ${token.access_token}`
    }});
}

const authPutRequest = (endpoint, body, token) => {
    return axios.put(`${determineBackendURL()}/${endpoint}`, body, { headers: {
        "Authorization": `jwt ${token.access_token}`
    }});
}

export { authPostRequest, authPutRequest };