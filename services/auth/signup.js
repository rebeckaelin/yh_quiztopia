const {db} = require("../data/db")
const {v4: uuid} = require("uuid")
const {sendResponse, sendError} = require("../utils/responses");
const { hashPassword } = require("../utils/hashPassword");
const { getUser } = require("../utils/getUser");


exports.handler = async (event) => {
    const {username, password} = JSON.parse(event.body)

    if (!username || username.trim() === "" || !password || password.trim() === "") {
        return sendError(400, "Username and password are required.");
    }

    const usernameRegex = /^[a-zA-Z]+$/; // Endast bokstäver
    if (!usernameRegex.test(username)) {
        return sendError(400, "Username can only contain letters (A-Z, a-z).");
    }

    let hashedPassword
    try {
        hashedPassword =  await hashPassword(password)
        
    } catch (error) {
        return sendError(500, "Error while hashing password" + error.message)
    }

    try {

        const userExists = await getUser(username)
        if(userExists) {
            return {
                statusCode: 409,
                body: JSON.stringify({message: "Username already exists"})
            }
        }

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