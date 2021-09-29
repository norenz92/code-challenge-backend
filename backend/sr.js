import axios from 'axios';
import cron from 'node-cron';
import * as db from './db.js';

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

    let areaUsers = await db.getUsersByArea();
    console.log(areaUsers)

    for await (const area of Object.keys(areaUsers)) {
      console.log(area)
      try {
        let response = await axios.get(baseUrl+'/messages', {
          params: {
              format: 'json',
              size: 99999,
              trafficareaname: area
          }
        })
        let messages = [];
        if (response.status === 200) {
          messages.push(...response.data.messages);
          console.log(messages)
        } else {
          throw new Error(response.statusText)
        }
      } catch (err) {
        console.log(err)
      }
    }

    
}





