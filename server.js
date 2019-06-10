const express = require('express');
const server = express();

const userRouter = require('./routers/userRouter');



server.use(express.json());
server.use(logger);


server.get('/', (req,res) => {
    res.status(200).json({auth: "rocks!!!"})
})

server.use('/users', userRouter);



/**************************************/
/*      Custom Middleware             */
/**************************************/

function logger(req, res, next) {
    console.log(`Method: ${req.method} requested at URL: ${req.url} on ${new Date().toISOString()}`);
    next();
} 


module.exports = server;