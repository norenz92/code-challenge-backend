import { Low, JSONFile } from 'lowdb';
import cron from 'node-cron';

const db = new Low(new JSONFile('file.json'))

export const init = () => {
    // Run cleaning at start
    cleaningService();

    // Every minute, clean expired subscribes
    console.log('Starting cleaning worker')
    cron.schedule('* * * * *', () => {
        cleaningService();
    });
}

const cleaningService = async () => {
    console.log('Running cleaning service..')
    try {
        await db.read()
        
        // Loop through users and check expire time
        Object.keys(db.data.users).forEach(user => {
            let currentTime = new Date().getTime();
            let userExpireTime = new Date(db.data.users[user].expiresAt).getTime();
            if(currentTime > userExpireTime) {
                // Delete user
                console.log('Delete: ' + user)
                delete db.data.users[user];
            } else {
                // Keep user
                console.log('Keep: ' + user)
            }
        })

        await db.write()

    } catch (err) {
        console.log(err)
    }
}

export const addUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!validEmail(data.email)) {
                console.log('Invalid email')
                return reject({success: false, message: 'Invalid email'})
            }
            if((!data.area) || (data.area === '')) {
                console.log('Invalid or missing area')
                return reject({success: false, message: 'Invalid or missing area'})
            }
            // Read data from JSON file, this will set db.data content
            await db.read()

            // If file.json doesn't exist, db.data will be null
            // Set default data
            db.data = db.data || { users: {} }
            // db.data = db.data || { posts: [] } // for node < v15.x

            // Create item
            db.data.users[data.email] = {
                ...data,
                notifications: {}
            }

            // Write db.data content to db.json
            await db.write()
            resolve({success: true, message: null})
        } catch (err) {
            console.log(err)
            reject({success: false, message: 'Kunde inte lägga till epost'})
        }
    })
}

export const deleteUser = (req) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Read data from JSON file, this will set db.data content
            await db.read()
            // db.data = db.data || { posts: [] } // for node < v15.x
            // Create item
            if (db.data.users[req.body.email]) {
                delete db.data.users[req.body.email];
            } else {
                reject({success: false, message: "Eposten existerar inte"})
            }

            // Write db.data content to db.json
            await db.write()
            resolve({success: false, message: 'Epost borttagen!'})
        } catch (err) {
            console.log(err)
            reject({success: false, message: 'Kunde inte ta bort epost'})
        }
    })
}

export const listUsers = async () => {
  try {
      await db.read()
      return db.data.users;
  } catch (err) {
      console.log(err)
      return err;
  }
}

export const updateUsers = async (users) => {
  try {
    await db.read()
    db.data.users = users;
    await db.write()
  } catch (err) {
    console.log(err)
  }
}

export const getUsersByArea = async () => {
  try {
      await db.read()
      let users = db.data.users;
      let result = Object.keys(users).reduce((objectsByKeyValue, obj) => {
        const value = users[obj]['area'];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});

      return result;
  } catch (err) {
      console.log(err)
      return err;
  }
}

const validEmail = (email) => {
    let regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    return regex.test(email)
}