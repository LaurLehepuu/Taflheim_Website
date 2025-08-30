const db = require('mysql2')
const dotenv = require('dotenv')
const { appDbConfig } = require('../config/database_config')

dotenv.config()


//This connection can access anything BUT user_login_info
class AppDatabase {
    constructor() {
        this.pool = db.createPool(appDbConfig).promise()
    }
}

module.exports = new AppDatabase()
