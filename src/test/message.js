require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})


const SAMPLE_OBJECT_ID = '313131313131313131313131' // 12 byte string
const SAMPLE_OBJECT_ID_2 = '323232323232323232323232' // 12 byte string

describe('Message API endpoints', () => {
    beforeEach((done) => {
        const sampleUser = new User({
            username: 'myuser',
            password: 'mypassword',
            _id: SAMPLE_OBJECT_ID
        })
        const sampleMessage = new Message({
            title:'mytitle',
            body:'mybody',
            author:sampleUser._id,
            _id:SAMPLE_OBJECT_ID_2,
        })
        sampleUser.save().then(
            sampleMessage.save()
        ).then(
            done()
        ).catch(err =>{
            console.log(err)})
    })

    afterEach((done) => {
        User.deleteMany({ username: ['myuser'] }).then(() => {
            Message.deleteMany({ title: "Test Message" })
            .then(() => {
                done()
            })
        })
    })

    it('should load all messages', (done) => {
        chai.request(app)
        .get('/messages')
        .end((err,res)=>{
            if(err) {done(err)}
            expect(res).to.have.status(200)
            expect(res.body.message).to.be.an("array")
            done()
        })
    })

    it('should get one specific message', (done) => {
        chai.request(app)
        .get(`/messages/${SAMPLE_OBJECT_ID_2}`)
        .end((err,res)=>{
            if(err) {done(err)}
            expect(res).to.have.status(200)
            expect(res.body).to.be.an("object")
            // expect(res.body.title).to.equal('mytitle')
            // expect(res.body.body).to.equal('mybody')
            // expect(res.body.author).to.equal(SAMPLE_OBJECT_ID)
            done()
        })
    })

    it('should post a new message', (done) => {
        chai.request(app)
        .post('/messages')
        .send({
            title:'mytitle',
            body: 'mybody',
            author: SAMPLE_OBJECT_ID,
        }).end((err,res)=>{
            if (err) { done(err) }
            expect(res).to.have.status(200)
            done()
        })
    })

    it('should update a message', (done) => {
        chai.request(app)
        .put(`/messages/${SAMPLE_OBJECT_ID_2}`)
        .send({
            title:'Update mytitle',
            body: 'Update mybody',
            author: SAMPLE_OBJECT_ID,
        })
        .end((err,res)=>{
            if (err) { done(err) }
            expect(res).to.have.status(200)
            done()
        })
    })

    it('should delete a message', (done) => {
        chai.request(app)
        .delete(`/messages/${SAMPLE_OBJECT_ID_2}`)
        .end((err,res)=>{
            if (err) { done(err) }
            expect(res).to.have.status(200)
            done()
        })
    })
})
