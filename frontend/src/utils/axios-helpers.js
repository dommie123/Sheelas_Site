import axios from "axios";
import { determineBackendURL } from "../AppConfig";

export const authPostRequest = (endpoint, body, token) => {
    return axios.post(`${determineBackendURL()}/${endpoint}`, body, { headers: {
        "Authorization": `jwt ${token.access_token}`
    }});
}