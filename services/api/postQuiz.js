const {db} = require("../data/db")
const {v4: uuid} = require("uuid")
const {sendResponse, sendError} = require("../utils/responses");
const { validateToken } = require("../../middleware/validateToken");
const middy = require("@middy/core");
const { getQuiz } = require("../utils/getQuizByUsernameAndUserId");

const handler = middy().use(validateToken()).handler(async (event) => {
    const {quizname, questions} = JSON.parse(event.body)
    const loggedInUser = event.userId

    if (!quizname || quizname.trim() === "") {
        return sendError(400, "Quizname is required.");
    }

    if (!Array.isArray(questions) || questions.length === 0) {
        return sendError(400, "Questions must be a non-empty array.");
    }

    for (const question of questions) {
        if (!question.question || question.question.trim() === "" || 
            !question.answer || question.answer.trim() === "" || 
            !question.location) {
            return sendError(400, "Each question must have a non-empty question, answer, and a valid location.");
        }
    }

    try {

        const existingQuiz = await getQuiz(quizname, loggedInUser)
        if(existingQuiz) {
            return sendError(409, `You already have a quiz named ${quizname} . Please choose another name for your quiz.`)
        }
        
        const newQuiz = {
            quizType: "quiz",
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
        console.error("error creating quiz:" , error)
        return sendError(400, "Error creating quiz..")
    }

})

module.exports = {handler}