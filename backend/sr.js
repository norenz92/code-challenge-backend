import axios from 'axios';
import cron from 'node-cron';
import * as db from './db.js';
import { sendMail } from './mailer.js';

export const init = () => {
    // Every minute, check SR api
    console.log('Starting SR worker')
    cron.schedule('* * * * *', () => {
        runCheck()
    });
}

const baseUrl = 'http://api.sr.se/api/v2/traffic';

const runCheck = async () => {
    console.log('Running SR worker')
    let usersByArea = await db.getUsersByArea();

    for await (const area of Object.keys(usersByArea)) {
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
        } else {
          throw new Error(response.statusText)
        }

        let users = await db.listUsers();

        usersByArea[area].forEach(user => {
          messages.forEach(async message => {
            if (!(message.id in users[user].notifications)) {
              users[user].notifications[message.id] = message
              await sendMail(user, message)
            }
          })
        })

        db.updateUsers(users)

      } catch (err) {
        console.log(err)
      }
    }

    
}





