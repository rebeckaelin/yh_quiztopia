const jwt = require("jsonwebtoken")

const signToken = (user) => {
    const token = jwt.sign({userId: user.userId}, process.env.SECRET, {
        expiresIn: 7200,
    })
    return token
}



module.exports = {signToken}