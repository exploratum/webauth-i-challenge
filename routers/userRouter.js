const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs')

const userModel = require('../models/userModel')


/****************************************************************************/
/*                              Get all Users                               */
/****************************************************************************/
router.get('/users', restricted, async (req, res) => {
    try {
        users = await userModel.findAll();
        res.status(200).json(users);
    }
    catch {
        res.status(500).json({"errorMessage": "Cannot get record(s) from database"})
    }

});

/****************************************************************************/
/*                              Get a user by id                             */
/****************************************************************************/
router.get('/:id', async (req, res) => {

    id = req.params.id;

    try {
        user = await userModel.findById(id);
        res.status(200).json(user);
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

/****************************************************************************/
/*                              user login                                  */
/****************************************************************************/

router.post('/login', validateUserInfo, validateUser, async (req,res) => {
    let user = req.body.user;
    let password = req.body.password;

    try {
        if (bcrypt.compareSync(password, user.password)) {
            req.session.username = user.username;
            res.status(200).json({message: `welcome ${user.username}`});
        }
        else {
            res.status(401).json({errorMessage: `wrong username and/or password`});
        }
    } 
    catch {
        res.status(500).json({"errorMessage": "That was a problem login you in"})
    }
})

/****************************************************************************/
/*                              user logout                                 */
/****************************************************************************/

router.delete('/users', async (req,res) => {

    try {
        if (req.session) {
            req.session.destroy();
            res.status(200).json({message: `good bye`});
        }
        else {
            res.status(401).json({errorMessage: `You were not logged in`});
        }
    } 
    catch {
        res.status(500).json({"errorMessage": "That was a problem login you out"})
    }
})
/*********************************************************************************************************/
/*                                           MIDDLEWARE                                                  */
/******************************************************************************************************** */


/****************************************************************************/
/*                          Verify that user is logged in                   */
/****************************************************************************/

function restricted (req, res, next) {
    if (req.session && req.session.username) {
        console.log(req.session);
        next()
    }
    else {
        res.status(401).json({errorMessage: "Bad credentials!"})
    }
}

/****************************************************************************/
/*                 Verify that user exists and save user in req             */
/****************************************************************************/
async function validateUser(req,res,next) {
    let username = req.body.username;

    if (username) {
        let user = await userModel.findByUsername(username);
        if (user) {
            req.body.user = user;
            next();
        }
        else {
            res.status(401).json({"errorMessage":"invalid username"});
        }
    }
    else {
        res.status(400).json({"errorMessage":"username is required"});
    }
    
}

/****************************************************************************/
/*                 Check username and password exist i body                 */
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