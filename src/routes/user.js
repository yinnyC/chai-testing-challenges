const express = require('express')
const router = express.Router();

const User = require('../models/user')

/** Route to get all users. */
router.get('/', (req, res) => {
    return res.send(`All Users route`)
})

/** Route to get one user by id. */
router.get('/:userId', (req, res) => {
    return res.send(`User with id ${req.params.userId}`)
})

/** Route to add a new user to the database. */
router.post('/', (req, res) => {
    return res.send({
        message: 'Create new user',
        data: req.body
    })
})

/** Route to update an existing user. */
router.put('/:userId', (req, res) => {
    return res.send({
        message: `Update user with id ${req.params.userId}`,
        data: req.body
    })
})

/** Route to delete a user. */
router.delete('/:userId', (req, res) => {
    return res.send(`Delete user with id ${req.params.userId}`)
})

module.exports = router

