const {db} = require("../data/db")
const {sendResponse, sendError} = require("../utils/responses");

exports.handler = async() => {
    try {
        const result = await db.query({
            TableName: "quizes",
            KeyConditionExpression: "quizType = :type",
            ExpressionAttributeValues: {
                ":type": "quiz"
            } 
        })

        return sendResponse(200, "Success", result.Items)
        
    } catch (error) {
        sendError(500, "Error fetching quizes.")
    }
}