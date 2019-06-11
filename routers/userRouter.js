const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs')

const userModel = require('../models/userModel')


/****************************************************************************/
/*                              Get all Users                               */
/****************************************************************************/
router.get('/', async (req, res) => {
    try {
        users = await userModel.find();
        res.status(200).json(users);
    }
    catch {
        res.status(500).json({"errorMessage": "Cannot get record(s) from database"})
    }

});

/****************************************************************************/
/*                              Add a new  user                             */
/****************************************************************************/

router.post('/register', validateUserInfo, async (req,res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    try {
        id = await userModel.add(user);
        res.status(201).json({message: `id of new user: ${id}`});
    }
    catch {
        res.status(500).json({"errorMessage": "That was a problem adding the record(s)"})
    }
})

// /****************************************************************************/
// /*                               Validate username                          */
// /****************************************************************************/
// async function validateUsername(req,res,next) {
//     username = req.username;

//     if (username) {
//         const username = db.findByUsername(req.username);
//         if (username) {
//             next();
//         }
//         else {
//             res.status(401).json({"errorMessage":"invalid username"});
//         }
//     }
//     else {
//         res.status(400).json({"errorMessage":"username is required"});
//     }
    
// }

/****************************************************************************/
/*                              Validate user info                          */
/****************************************************************************/
async function validateUserInfo(req, res, next) {
    const body = req.body
    if(body.username && body.password) {
        next();
    }
    else {
        res.status(400).json({"errorMessage":"name and description are required"});
    }
}


module.exports = router;