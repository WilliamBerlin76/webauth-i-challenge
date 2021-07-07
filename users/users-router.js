const router = require('express').Router();

const Users = require('./users-model.js');
const requiresAuth = require('../auth/auth-required-middleware.js');

router.get('/', requiresAuth, (req, res) => {
   Users.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;