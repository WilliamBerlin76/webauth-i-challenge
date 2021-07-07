const bcrypt = require('bcryptjs');

const router = require('express').Router();

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
    let userInfo = req.body;
    const hash = bcrypt.hashSync(userInfo.password, 10);
    userInfo.password = hash
        Users.add(userInfo)
            .then(saved => {
                req.session.username = saved.username
                res.status(201).json(saved);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    });

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)){
                req.session.username = user.username;
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

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(error => {
            if (error) {
                res.status(500).json({message: 'you can checkout but you can not leave'})
            } else {
                res.status(200).json({message: 'logged out'});
            } 
        });
    } else {
        res.status(200).json({ message: "later"})
    }
})
module.exports = router;