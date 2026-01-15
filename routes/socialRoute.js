const { Router } = require('express')

const socialRouter = Router()

socialRouter.get('/test', (req, res) => {
    res.send('connection established')
})

module.exports = socialRouter