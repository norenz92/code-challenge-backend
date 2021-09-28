import axios from 'axios';
import cron from 'node-cron';
import db from '../db/index';

export const init = () => {
    // Run cleaning at start
    runCheck();

    // Every minute, check SR api
    console.log('Starting SR worker')
    cron.schedule('* 0 * * *', () => {
        runCheck()
    });
}

const baseUrl = 'http://api.sr.se/api/v2/traffic';

const runCheck = async () => {

    let users = await db.listUsers();

    return new Promise((resolve, reject) => {
        axios.get(baseUrl+'/messages', {
            params: {
                format: 'json',
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





