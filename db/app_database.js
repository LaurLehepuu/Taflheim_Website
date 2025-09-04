const db = require('mysql2')
const dotenv = require('dotenv')
const { appDbConfig } = require('../config/database_config')

dotenv.config()


//This connection can access anything BUT user_login_info
class AppDatabase {
    constructor() {
        this.pool = db.createPool(appDbConfig).promise()
    }

    async findRatingInfo(user_id) {
        const [rating_info] = await this.pool.query(`
            SELECT rating
            FROM user_ratings
            WHERE user_id = ?
            `, [user_id])
        return rating_info[0].rating
    }
}

module.exports = new AppDatabase()
