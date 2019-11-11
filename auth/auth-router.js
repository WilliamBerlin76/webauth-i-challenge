const bcrypt = require('bcryptjs');

const router = require('express').Router();

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
    let userInfo = req.body;

    bcrypt.hash(userInfo.password, 12, (err, hashedPassword) => {
        userInfo.password = hashedPassword;

        Users.add(userInfo)
            .then(saved => {
                res.status(201).json(saved);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)){
                res.status(200).json({ message: `Welcome ${username}`})
            } else {
                res.status(401).json({ message: 'You shall not pass!' })
            }
        })
        .catch(error => {
            console.log('login error', error);
            res.status(500).json(error)
        })
});

module.exports = router;