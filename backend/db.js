import { Low, JSONFile } from 'lowdb';
import cron from 'node-cron';

const db = new Low(new JSONFile('file.json'))

export const init = () => {
    // Run cleaning at start
    cleaningService();

    // Every hour, clean expired subscribes
    console.log('Starting cleaning worker')
    cron.schedule('0 * * * *', () => {
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

export const addUser = async (data) => {
    try {
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
        return {success: false, message: null}
    } catch (err) {
        console.log(err)
        return {success: false, message: 'Kunde inte lägga till epost'}
    }
}

export const deleteUser = async (email) => {
    try {
        // Read data from JSON file, this will set db.data content
        await db.read()
        // db.data = db.data || { posts: [] } // for node < v15.x
        // Create item
        if (db.data.users[email]) {
            delete db.data.users[email];
        } else {
            return {success: false, message: "Eposten existerar inte"}
        }

        // Write db.data content to db.json
        await db.write()
        return {success: false, message: 'Epost borttagen!'}
    } catch (err) {
        console.log(err)
        return {success: false, message: 'Kunde inte ta bort epost'}
    }
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