const {db} = require("../data/db")
const {v4: uuid} = require("uuid")
const {sendResponse, sendError} = require("../utils/responses");
const { hashPassword } = require("../utils/hashPassword");


exports.handler = async (event) => {
    const {username, password} = JSON.parse(event.body)

    const hashedPassword =  await hashPassword(password)
    
    try {

        const newUser = {
            userId: uuid(),
            username: username,
            password: hashedPassword
        }
        await db.put({
            TableName: "users",
            Item: newUser          
        })
        return sendResponse(201, "New user created", newUser)
        
    } catch (error) {
        return sendError(500, error.message) 
    }

}