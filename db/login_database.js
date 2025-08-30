const db = require('mysql2')
const dotenv = require('dotenv')
const { loginDbConfig } = require('../config/database_config')

dotenv.config()

//This connection can ONLY access user_login_info and user_profiles
class LoginDatabase {
    constructor() {
        this.pool = db.createPool(loginDbConfig).promise()
    }

    async checkUsernameExists(username) {
        const [rows] = await this.pool.query(`
            SELECT user_id
            FROM user_profiles
            WHERE username = ?
            `, [username]);
        return rows.length > 0;
    }

    async checkEmailExists(email) {
        const [rows] = await this.pool.query(`
            SELECT id
            FROM user_login_info
            WHERE email = ?
            `, [email]);
        return rows.length > 0;
    }

    async createUserWithProfile(email, hashed_password, username) {
        const connection = await this.pool.getConnection();
    
        try {
        await connection.beginTransaction();
        
        //Add user to user_login_info
        const [userResult] = await connection.query(`
            INSERT INTO user_login_info (email, hashed_password) 
            VALUES (?, ?)
            `,[email, hashed_password]);
        
        const user_id = userResult.insertId;
        
        //Add user to user_profiles
        await connection.execute(`
            INSERT INTO user_profiles (email, user_id, username)
            VALUES (?, ?, ?)
            `,[email, user_id, username]
        );
        
        await connection.commit();
        return { user: this.getUserProfile(user_id), success: true };
        
        } catch (error) {
        await connection.rollback();
        throw error;
        } finally {
        connection.release();
        }
    }

    //Returns the user from user_profiles
    async getUserProfile(user_id) {
        const [rows] = await this.pool.query(`
            SELECT *
            FROM user_profiles
            WHERE user_id = ?
            `, [user_id])

            return rows[0]
    }
}

module.exports = new LoginDatabase();





