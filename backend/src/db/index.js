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

    } catch (err) {
        console.log(err)
    }
}

export const addUser = (data) => {
    return new Promise(async(resolve, reject) => {
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
            resolve({success: false, error: null})
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

export const deleteUser = (email) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Read data from JSON file, this will set db.data content
            await db.read()
            // db.data = db.data || { posts: [] } // for node < v15.x
            // Create item
            if (db.data.users[email]) {
                delete db.data.users[email];
            } else {
                reject({success: false, error: "User does not exist"})
            }

            // Write db.data content to db.json
            await db.write()
            resolve({success: false, error: null})
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

export const listUsers = () => {
    return new Promise(async(resolve, reject) => {
        try {
            await db.read()
            resolve(db.data)
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

export const getUsersByArea = (area) => {
    return new Promise(async(resolve, reject) => {
        try {
            await db.read()
            let users = db.data.users.filter((value, index, arr) => area === value.area)
            resolve(users)
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}