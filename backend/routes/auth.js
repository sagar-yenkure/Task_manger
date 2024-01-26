const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY;



//! ROUTE: 01 create a user using: POST "api/auth/CreatUser". Doesn't require Auth
router.post('/createuser', async (req, res) => {
    const { username, email, password } = req.body
    let success = false;
    try {
        // cheakes where email id already exists
        let user = await User.findOne({ email });


        if (user) {
            success = false; // if user email  already exists then error
            return res.status(400).json({ success, error: "User with this Email ID alredy exits, Please Login" })
        }
        // creating a salt for password and creating a hash of passwords
        const salt = await bcrypt.genSalt(10);
        const HashedPassword = await bcrypt.hash(password, salt);

        // if not exists then craete a user
        user = await User.create({
            username: username.lenght===0?"unknown":username,
            email: email,
            password: HashedPassword,
        })
        if (!user) {
            res.status(500).json({error: "user creation failed" })

        }
        success = true;
        res.json({ success,msg: "user is created " })
    }
    catch (error) { // cathches error in above code
        success = false
        res.status(500).json({ msg: "some problem accured in sign up" })
        console.log(error)

    }
})


//! ROUTE: 02 Autthenticate a user using : post "/api/auth/login". No login requierd
router.post('/Login',async (req, res) => {
    let success = false;
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });//searching email in data base
        if (!user) { // if email not found  then error
            success = false;
            return res.status(400).json({ success, error: "Please try again with correct Email and Password !" })
        }             
        const passwordcompare = await bcrypt.compare(password, user.password)
        if (!passwordcompare) { 
            success = false;
            return res.status(400).json({ success, error: "Please try again with correct Email and Password !" })
        }                        // if the entered email and password is macthes then send token.
        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, JWT_KEY)
        success = true;
        res.json({ success, token })


    } catch (error) {
        res.status(500).json({error:"some problem accured in login"})
        console.log(error)
    }




})



module.exports = router // exporting auth