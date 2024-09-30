
const {sendResponse, sendError} = require("../utils/responses");
const { comparePassword } = require("../utils/comparePassword");
const { getUser } = require("../utils/getUser");
const { generateToken } = require("../auth/generateToken");

exports.handler = async (event) => {
    const {username, password} = JSON.parse(event.body)

    try {
        const user = await getUser(username)
        console.log("Fetched user:", user);
        
        const correctPassword = await comparePassword(password, user)
        
        if (!correctPassword) {return sendError(401, "Wrong username or password!")}

        token = generateToken(user)
        
        return sendResponse(200, "Login successful", token)
        
    } catch (error) {
        return sendError(500, error.message)
    }
}
