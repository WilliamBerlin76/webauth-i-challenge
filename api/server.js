const express = require('express');
const session = require('express-session');
const KnexSessionStorage = require("connect-session-knex")(session);

const apiRouter = require('./api-router.js');
const knexConnection = require('../data/dbConfig.js')
const configureMiddleware = require('./configure-middleware');

const server = express();

const sessionConfiguration = {
    name: "chip",
    secret: process.env.COOKIE_SECRET || "is it secret? is it save?",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStorage({
        knex: knexConnection,
        clearInterval: 1000 * 60 * 10,
        tablename: "user_sessions",
        sidfieldname: "id",
        createtable: true
    })
};


configureMiddleware(server);

server.use(session(sessionConfiguration));

server.use('/api', apiRouter);

server.get("/", (req, res) => {
    res.json({ api: "up", session: req.session})
})

module.exports = server;