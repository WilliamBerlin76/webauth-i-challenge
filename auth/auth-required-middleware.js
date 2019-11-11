const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
    let {username, password} = req.headers;

    if (username && password) {
        
        Users.findBy({ username })
            .first()
            .then(user => {
                if(user && bcrypt.compareSync(password, user.password)) {
                    next();
                } else {
                    res.status(401).json({ message: 'You shall not pass' });
                }
            })
            .catch(err => {
                console.log('login error', err);
                res.status(500).json({error: 'serverside error verifying credentials'})
            })
    } else {
        res.status(400).json({ message: 'please provide credentials' });
    }
};