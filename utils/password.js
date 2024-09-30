const bcrypt = require("bcryptjs")

const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}

const comparePassword = async (password, user) => {
    const isCorrect = await bcrypt.compare(password, user.password)
    return isCorrect
}


module.exports = {hashPassword , comparePassword}