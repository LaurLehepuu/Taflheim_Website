const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const loginDb = require('../db/login_database')
router.use(express.urlencoded({ extended: false }))

router.get('/', (req, res) => {
    res.render("register");
})

router.post('/', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const step = parseInt(req.body.step) || 1;
        
        // STEP 1: Check if email is already in use
        if (step == 1) {
            const emailExists = await loginDb.checkEmailExists(email);
            
            if (emailExists) {
                return res.render("register", {
                    step: 1,
                    error: "Email already registered. Try logging in instead.",
                    email: email,
                    username: null
                });
            }
            
            // Email is available, move to step 2
            return res.render("register", {
                step: 2,
                error: null,
                email: email,
                username: null
            });
        }
        
        // STEP 2: Check username and create user
        if (step == 2) {
            
            // Double-check email again
            const emailExists = await loginDb.checkEmailExists(email);
            
            if (emailExists) {
                return res.render("register", {
                    step: 1,
                    error: "Email already registered. Try logging in instead.",
                    email: email,
                    username: null
                });
            }
            
            // Check if username is in use
            const usernameExists = await loginDb.checkUsernameExists(username);
            
            if (usernameExists) {
                return res.render("register", {
                    step: 2,
                    error: "Username already taken. Please choose another.",
                    email: email,
                    username: username
                });
            }
            
            // If all is good, hash password and add person to database
            const hashedPassword = await bcrypt.hash(password, 10);
            
            await loginDb.createUserWithProfile(email, hashedPassword, username);
            
            // Success! Redirect to login with success message
            return res.redirect('/login?register=success');
        }
        
        // If we get here, something unexpected happened
        return res.render("register", {
            step: 1,
            error: "Invalid step. Please start over.",
            email: null,
            username: null
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        console.error('Error stack:', error.stack);
        
        // Determine which step to show on error
        const step = req.body.step == 2 ? 2 : 1;
        res.render("register", {
            step: step,
            error: "Something went wrong. Please try again.",
            email: req.body.email || null,
            username: req.body.username || null
        });
    }
})

module.exports = router;
