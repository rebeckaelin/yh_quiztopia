const {db} = require("../data/db")
const {sendResponse, sendError} = require("../utils/responses");


exports.handler = async (event) => {
    const quizId = event.pathParameters.quizId
    try {

        const result = await db.query({
            TableName: "leaderboard",
            KeyConditionExpression: "quizId = :quizId",
            ExpressionAttributeValues: {
                ":quizId": quizId
            },
            ScanIndexForward: false
        })

        return sendResponse(200, "Success", result.Items)
        
    } catch (error) {
        return sendError(500, "Error fetching leaderboard.")
    }


}