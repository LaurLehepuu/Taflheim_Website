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
        
        console.log('Registration POST triggered:', { email, username, step });
        
        // STEP 1: Check if email is already in use
        if (step == 1) {
            console.log('Processing step 1 - checking email');
            const emailExists = await loginDb.checkEmailExists(email);
            console.log('Email exists check result:', emailExists);
            
            if (emailExists) {
                return res.render("register", {
                    step: 1,
                    error: "Email already registered. Try logging in instead.",
                    email: email,
                    username: null
                });
            }
            
            // Email is available, move to step 2
            console.log('Email available, moving to step 2');
            return res.render("register", {
                step: 2,
                error: null,
                email: email,
                username: null
            });
        }
        
        // STEP 2: Check username and create user
        if (step == 2) {
            console.log('Processing step 2 - checking username and creating user');
            
            // Double-check email again
            console.log('Double-checking email:', email);
            const emailExists = await loginDb.checkEmailExists(email);
            console.log('Email exists on step 2:', emailExists);
            
            if (emailExists) {
                return res.render("register", {
                    step: 1,
                    error: "Email already registered. Try logging in instead.",
                    email: email,
                    username: null
                });
            }
            
            // Check if username is in use
            console.log('Checking username:', username);
            const usernameExists = await loginDb.checkUsernameExists(username);
            console.log('Username exists check result:', usernameExists);
            
            if (usernameExists) {
                return res.render("register", {
                    step: 2,
                    error: "Username already taken. Please choose another.",
                    email: email,
                    username: username
                });
            }
            
            // If all is good, hash password and add person to database
            console.log('All validation passed - creating user');
            console.log('Hashing password...');
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Password hashed successfully');
            
            console.log('Creating user with profile...');
            await loginDb.createUserWithProfile(email, hashedPassword, username);
            console.log('User created successfully!');
            
            // Success! Redirect to login with success message
            console.log('Redirecting to login...');
            return res.redirect('/login?register=success');
        }
        
        // If we get here, something unexpected happened
        console.log('Unexpected step value:', step);
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
