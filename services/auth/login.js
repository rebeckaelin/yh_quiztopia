
const {sendResponse, sendError} = require("../utils/responses");
const { comparePassword } = require("../utils/comparePassword");
const { getUser } = require("../utils/getUser");
const { generateToken } = require("../auth/generateToken");

exports.handler = async (event) => {
    const {username, password} = JSON.parse(event.body)

    if (!username || username.trim() === "" || !password || password.trim() === "") {
        return sendError(400, "Username and password are required.");
    }

    try {
        const user = await getUser(username)
        
        if(!user) {
            return sendError(401, "Wrong username or password")
        }
        
        const correctPassword = await comparePassword(password, user)
        if (!correctPassword) {return sendError(401, "Wrong username or password")}

        const token = generateToken(user)
        
        return sendResponse(200, "Login successful", {token: token})
        
    } catch (error) {
        return sendError(500, "Internal server error")
    }
}
