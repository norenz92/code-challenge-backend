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