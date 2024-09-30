const bcrypt = require("bcryptjs")

const comparePassword = async (password, user) => {
    const isCorrect = await bcrypt.compare(password, user.password)
    return isCorrect
}

module.exports = {comparePassword}