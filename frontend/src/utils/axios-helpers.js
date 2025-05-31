import axios from "axios";
import { determineBackendURL } from "../AppConfig";

const authPostRequest = (endpoint, body, token) => {
    return axios.post(`${determineBackendURL()}/${endpoint}`, body, { headers: {
        "Authorization": `Bearer ${token.access_token}`
    }});
}

const authPostRequestWithFile = (endpoint, formData, token) => {
    return axios.post(`${determineBackendURL()}/${endpoint}`, formData, { headers: {
        "Authorization": `Bearer ${token.access_token}`,
        "Content-Type": 'multipart/form-data'
    }});
}

const authPutRequest = (endpoint, body, token) => {
    return axios.put(`${determineBackendURL()}/${endpoint}`, body, { headers: {
        "Authorization": `Bearer ${token.access_token}`
    }});
}

const authDeleteRequest = (endpoint, token) => {
    return axios.delete(`${determineBackendURL()}/${endpoint}`, { headers: {
        "Authorization": `Bearer ${token.access_token}`
    }});
}

export { authPostRequest, authPostRequestWithFile, authPutRequest, authDeleteRequest };