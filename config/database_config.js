const dotenv = require('dotenv')
dotenv.config()

const loginDbConfig = {
  host: process.env.DB_HOST,
  user: 'login_admin',
  password: process.env.LOGIN_DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
};

const appDbConfig = {
  host: process.env.DB_HOST,
  user: 'content_admin',
  password: process.env.CONTENT_DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

module.exports = {
    loginDbConfig,
    appDbConfig
}
