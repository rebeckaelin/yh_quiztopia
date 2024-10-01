const {db} = require("../data/db")
const {sendResponse, sendError} = require("../utils/responses");
const { validateToken } = require("../../middleware/validateToken");
const middy = require("@middy/core");

const handler = middy().use(validateToken()).handler(async (event)=> {
    const {quizId, points} = JSON.parse(event.body)
    loggedInUser = event.userId

    if(!quizId || quizId.trim() === "") {
        return sendError(400, "Please provide a quizId.")
    }

    if(isNaN(points)) {
        return sendError(400, "Points must be a number.")
    }

    try {

        const newScore = {
            quizId: quizId,
            highscore: points,
            userId: loggedInUser
        }

        await db.put({
            TableName: "leaderboard",
            Item: newScore
        })

        return sendResponse(201, "Your highscore has been added successfully!", newScore)
        
    } catch (error) {
        console.error("error adding highscore:" , error)
        return sendError(400, "Error adding highscore..")
    }
})

module.exports = {handler}