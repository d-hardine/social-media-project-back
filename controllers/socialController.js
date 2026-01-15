const bcrypt = require('bcryptjs')
const db = require('../db/queries')

const signUpPost = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    console.log(hashedPassword)
    await db.createNewUser(req.body.username, req.body.displayName, hashedPassword)
    res.status(201).json({message: "inputted data for sign up OK"})
}

module.exports = { signUpPost }