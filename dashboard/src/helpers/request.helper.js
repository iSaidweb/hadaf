import axios from "axios"
import { API } from "../cfg"

export const getReq = (pref = '/') => {
    return axios(`${API}${pref}`, {
        headers: {
            'x-auth-token': `Bearer ${localStorage?.access}`
        }
    });
}
export const postReq = (pref = '/', data = {}) => {
    return axios.post(`${API}${pref}`, data, {
        headers: {
            'x-auth-token': `Bearer ${localStorage?.access}`
        }
    });
}
export const postForm = (pref = '/', data = {}) => {
    return axios.postForm(`${API}${pref}`, data, {
        headers: {
            'x-auth-token': `Bearer ${localStorage?.access}`
        }
    });
}