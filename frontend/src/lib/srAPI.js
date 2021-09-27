const axios = require('axios').default;

const baseUrl = 'http://api.sr.se/api/v2/traffic';

export const getMessages = async (trafficAreaName, date) => {
    return new Promise((resolve, reject) => {
        axios.get(baseUrl+'/messages', {
            params: {
                format: 'json',
                ...(trafficAreaName && {trafficareaname: trafficAreaName}),
                ...(date && {date: date}),
            }
        })
        .then(res => {
            if (res.status === 200) {
                resolve(res)
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

}