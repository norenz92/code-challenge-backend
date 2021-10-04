import axios from 'axios';
import cron from 'node-cron';
import * as db from './db.js';
import { sendMail } from './mailer.js';

const baseUrl = 'http://api.sr.se/api/v2/traffic';

// Start the cron service
export const init = () => {
  // Every minute, check SR api
  console.log('Starting SR worker')
  cron.schedule('* * * * *', () => {
      runCheck()
  });
}

// Request to SR messages api.
const runCheck = async () => {
  console.log('Running SR worker')

  let usersByArea = await db.getUsersByArea();

  // Get the messages for each area that is present on any user. We skip the areas that are
  // not subscribed to.
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

      // get all the users
      let users = await db.listUsers();

      // Loop the users in usersByArea and send notify them on new events.
      // After that we add the event to the users blacklist so that they won't duplicate emails about this event.
      usersByArea[area].forEach(user => {
        messages.forEach(async message => {
          if (!(message.id in users[user].notifications)) {
            users[user].notifications[message.id] = message
            await sendMail(user, message)
          }
        })
      })

      // Save the users
      await db.updateUsers(users)

    } catch (err) {
      console.log(err)
    }
  }
}





