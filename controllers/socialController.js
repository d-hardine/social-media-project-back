const bcrypt = require('bcryptjs')

const signUpPost = async (req, res) => {
    //const hashedPassword = await bcrypt.hash(req.body.password, 10)
    res.status(201).json({message: 'connection established'})
}

module.exports = { signUpPost }