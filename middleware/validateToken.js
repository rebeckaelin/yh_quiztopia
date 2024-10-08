const jwt = require("jsonwebtoken")
const { sendError } = require("../services/utils/responses")

const validateToken = () => {
    return {
    before: async (request) => {
        try {
            const token = request.event.headers.authorization.replace("Bearer ", "")
            if (!token) throw new Error("Token missing")
            
            const data = jwt.verify(token, process.env.SECRET)
            // console.log('data from validate token', data)
            request.event.userId = data.userId
            return request.response
            
        } catch (error) {
            return sendError(401, "Not authorized")
        }
    }
}}




module.exports = { validateToken };