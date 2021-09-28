const axios = require('axios').default;

export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((res, err) => {
            if (err) {
                reject(err)
            }
            resolve(res)
        }
        );
    })
}

export const saveUserNotification = async (email, area) => {
    return new Promise((resolve, reject) => {
        let data = {
            createdAt: new Date().getTime(),
            expiresAt: new Date(new Date().setDate(new Date().getDate() + 1)).getTime(),
            email,
            area
        }
        axios.post('http://localhost:3001/addSubscriber', data).then(res => {
            resolve(res)
        }).catch(err => reject(err))
    })
}

export const deleteSubscriber = async (email) => {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:3001/deleteSubscriber', {email: email}).then(res => {
            resolve(res)
        }).catch(err => reject(err))
    })
}