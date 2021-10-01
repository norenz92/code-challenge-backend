
import axios from 'axios';

const baseUrl = 'http://api.sr.se/api/v2/traffic';

export const getMessages = async (trafficAreaName) => {
    return new Promise((resolve, reject) => {
        axios.get(baseUrl+'/messages', {
            params: {
                format: 'json',
                ...(trafficAreaName && {trafficareaname: trafficAreaName}),
                size: 99999
            }
        })
        .then(res => {
            if (res.status === 200) {
                resolve(res.data)
            } else {
                throw new Error(res.statusText)
            }
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const listTrafficAreas = async (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    axios.get(baseUrl+'/areas', {
        params: {
            format: 'json',
            ...(latitude && {latitude}),
            ...(longitude && {longitude}),
            size: 99999
        }
    })
    .then(res => {
        if (res.status === 200) {
            resolve(res.data)
        } else {
            throw new Error(res.statusText)
        }
    })
    .catch(err => {
        reject(err)
    })
})
}