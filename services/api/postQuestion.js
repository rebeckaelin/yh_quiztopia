const {db} = require("../data/db")
const {sendResponse, sendError} = require("../utils/responses");
const { validateToken } = require("../../middleware/validateToken");
const middy = require("@middy/core");
const { getQuiz } = require("../utils/getQuiz")

const handler = middy().use(validateToken()).handler(async (event) => {
    const { quizname, newQuestions } = JSON.parse(event.body)
    const loggedInUser = event.userId

    if (!quizname || newQuestions.length === 0) {
        return sendError(400, "Quizname and at least one question are required.");
    }
    if (!Array.isArray(newQuestions) || newQuestions.length === 0) {
        return sendError(400, "Questions must be a non-empty array.");
    }

    for (const question of newQuestions) {
        if (!question.question || question.question.trim() === "" || 
            !question.answer || question.answer.trim() === "" || 
            !question.location) {
            return sendError(400, "Each question must have a non-empty question, answer, and a valid location.");
        }
    }
    try {
        const existingQuiz = await getQuiz(quizname, loggedInUser)
        if(!existingQuiz) {
            return sendError(404, "Quiz not found")
        }

        const updatedQuestions = [...existingQuiz.questions, ...newQuestions]

        await db.update({
            TableName: "quizes",
            Key: {quizType: existingQuiz.quizType, quizId: existingQuiz.quizId},
            UpdateExpression: "SET questions = :questions",
            ExpressionAttributeValues: {
                ":questions": updatedQuestions
            },
            ReturnValues: "UPDATED_NEW"
        })

        return sendResponse(200, "New questions added successfully!", updatedQuestions)
    } catch (error) {
        console.error("Error adding questions:", error);
        return sendError(500, "Internal server error");
    }

})


module.exports = {handler}