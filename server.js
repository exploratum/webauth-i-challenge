const express = require('express');
const server = express();

const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const userRouter = require('./routers/userRouter');

const sessionConfig = {
    name:"gorilla",                                      //avoid default ssid name
    secret: "gorilla actually live in the deset!",      //Used for encryption
    resave: false,
    saveUninitialized: true,                             //false in production to comply with GDPR law
    httpOnly: true,                                     //No javascript access to cookie
    cookie: {
        maxAge: 1000*10,                             //in ms
        secure: false,                                  // using HTTPS or not
    },

    store: new knexSessionStore ({
        knex: require('./models/dbConfig'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearinterval: 1000*60*60                       //interval after which expired sessions are cleaned up

    })

}

server.use(express.json());
server.use(logger);
server.use(session(sessionConfig));


server.get('/', (req,res) => {
    res.status(200).json({auth: "rocks!!!"})
})

server.use('/api', userRouter);



/**************************************/
/*      Custom Middleware             */
/**************************************/

function logger(req, res, next) {
    console.log(`Method: ${req.method} requested at URL: ${req.url} on ${new Date().toISOString()}`);
    next();
} 


module.exports = server;