const {db} = require("../data/db")
const {v4: uuid} = require("uuid")
const {sendResponse, sendError} = require("../utils/responses");
const { validateToken } = require("../../middleware/validateToken");
const middy = require("@middy/core");
const {getQuiz} = require("../utils/getQuiz")

const handler = middy().use(validateToken()).handler(async (event) => {
    const {quizname, questions} = JSON.parse(event.body)
    const loggedInUser = event.userId

    if (!quizname || quizname.trim() === "") {
        return sendError(400, "Quizname is required.");
    }

    try {

        const existingQuiz = await getQuiz(quizname, loggedInUser)
        if(existingQuiz) {
            return sendError(409, "A quiz with this name for this user already exists. Please choose another one.")
        }
        
        const newQuiz = {
            quizId: uuid(),
            userId: loggedInUser,
            quizname: quizname,
            questions: questions
        }

        await db.put({
            TableName: "quizes",
            Item: newQuiz
        })
        return sendResponse(201, "Quiz created successfully", newQuiz)

        
    } catch (error) {
        return sendError(500, "Internal Server error")
    }

})

module.exports = {handler}