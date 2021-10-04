import axios from 'axios';

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

export const addSubscriber = async (email, area) => {
    return new Promise((resolve, reject) => {
        let data = {
            createdAt: new Date().getTime(),
            expiresAt: new Date(new Date().setDate(new Date().getDate() + 1)).getTime(),
            email,
            area
        }
        axios.post('https://doro.adamnoren.se/api/addSubscriber', data).then(res => {
          if (res.data.success) {
            resolve(res)
          } else {
            reject(res)
          }
        }).catch(err => reject(err))
    })
}

export const deleteSubscriber = async (email) => {
    return new Promise((resolve, reject) => {
        axios.post('https://doro.adamnoren.se/api/deleteSubscriber', {email: email}).then(res => {
            resolve(res)
        }).catch(err => reject(err))
    })
}