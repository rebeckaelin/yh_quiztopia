const {db} = require("../data/db")
const {sendResponse, sendError} = require("../utils/responses");
const { validateToken } = require("../../middleware/validateToken");
const middy = require("@middy/core");
const { getQuiz } = require("../utils/getQuizByUsernameAndUserId");
const { checkQuestionData } = require("../utils/checkQuestions");
const { checkForDuplicateQuestion } = require("../utils/checkForDuplicateQuestion");

const handler = middy().use(validateToken()).handler(async (event) => {
    const { quizname, newQuestions } = JSON.parse(event.body)
    const loggedInUser = event.userId

   try {
        await checkQuestionData(quizname, newQuestions)
   } catch (error) {
    return sendError(400, error.message)
   }
    try {
        const existingQuiz = await getQuiz(quizname, loggedInUser)
        if(!existingQuiz) {
            return sendError(404, "Quiz not found")
        }

        const existingQuestions = existingQuiz.questions
        
        try {
            await checkForDuplicateQuestion(existingQuestions, newQuestions)
            
        } catch (error) {
            return sendError(400, error.message)
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
        return sendError(500, "Error posting new questions..");
    }

})


module.exports = {handler}