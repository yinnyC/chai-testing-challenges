const express = require('express')
const router = express.Router();

const User = require('../models/user')
const Message = require('../models/message')

/** Route to get all messages. */
router.get('/', (req, res) => {
    // Get all Message objects using `.find()`
    Message.find()
    .then((message)=>{
        // Return the Message objects as a JSON list
        return res.json({message})
    }).catch((err)=>{
        throw err.message
    })
})

/** Route to get one message by id. */
router.get('/:messageId', (req, res) => {
    // Get the Message object with id matching `req.params.id`
    Message.findOne({'_id':req.params.messageId}).then((message)=>{
        // Return the matching Message object as JSON
        return res.json({message})
    }).catch((err) => {
        throw err.message
    })
})

/** Route to add a new message. */
router.post('/', (req, res) => {
    const message = new Message(req.body)
    message.save()
    .then(message => {
        return User.findById(message.author)
    })
    .then(user => {
        // console.log(user.messages)
        user.messages.unshift(message)
        return user.save()
    })
    .then(() => {
        return res.send(message)
    }).catch(err => {
        throw err.message
    })
})

/** Route to update an existing message. */
router.put('/:messageId', (req, res) => {
    
    Message.findByIdAndUpdate(
      req.params.messageId, req.body
    ).then(
        Message.findById(req.params.messageId)
    ).then(
      (message) => {
        return res.json({ message })
      }
    ).catch(err => {
      throw err.message
    })
  })

/** Route to delete a message. */
router.delete('/:messageId', (req, res) => {
    // Delete the specified Message using `findByIdAndDelete`. Make sure
    // to also delete the message from the User object's `messages` array
    Message.findByIdAndDelete(req.params.messageId)
    .then((deletedMessage)=>{
        return User.findById(deletedMessage.author)
    })
    .then((user)=>{
        return user.messages.filter(message => {
            return message._id.toString() != req.params.messageId.toString()
          })
    }) 
    .then(result => {
        return res.json({ msg: "Message has been deleted." })
      })
    .catch((err) => {
        throw err.message
    })
})
module.exports = router