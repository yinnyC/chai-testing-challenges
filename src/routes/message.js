const express = require('express')
const router = express.Router();

const Message = require('../models/message')
const User = require('../models/user')

/** Route to get all messages. */
router.get('/', (req, res) => {
    return res.send(`All Messages route`)
})

/** Route to get one message by id. */
router.get('/:messageId', (req, res) => {
    return res.send(`Message with id ${req.params.messageId}`)
})

/** Route to add a new message. */
router.post('/', (req, res) => {
    return res.send({
        message: 'Create new message',
        data: req.body
    })
})

/** Route to update an existing message. */
router.put('/:messageId', (req, res) => {
    return res.send({
        message: `Update message with id ${req.params.messageId}`,
        data: req.body
    })
})

/** Route to delete a message. */
router.delete('/:messageId', (req, res) => {
    return res.send(`Delete message with id ${req.params.messageId}`)
})

module.exports = router