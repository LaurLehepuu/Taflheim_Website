const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const login_db = require('../db/login_database')
const app_db = require('../db/app_database')

function initialize(passport) {
    const authenticateUser = async ( email, password, done) => {
        try {
            const user = await login_db.getUserByEmail(email)
            if (!user) {
                return done(null, false, { message: 'Incorrect password or email' })
            }

            if (await bcrypt.compare(password, user.hashed_password)) {
                return done(null, user)

            } else {
                return done(null, false, { message: 'Incorrect password or email' })
            }
        } catch (error) {
            done(error)
        }
    }


    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser( async (id, done) => {
        try {
            //Find user object and add their rating to it
            const user = await login_db.getUserById(id)
            const user_rating = await app_db.findRatingInfo(id)
            user.rating = Math.round(user_rating)

            done(null, user)
        } catch(error) {
            done(error)
        }
    })
}

module.exports = initialize
