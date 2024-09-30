const jwt = require("jsonwebtoken")

const generateToken = (user) => {
    const token = jwt.sign({userId: user.userId}, process.env.SECRET, {
        expiresIn: 7200,
    })
    return token
}



module.exports = {generateToken}