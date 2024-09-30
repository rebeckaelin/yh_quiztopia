const {db} = require("../data/db")
const {sendResponse, sendError} = require("../utils/responses");


const handler = async (event) => {
    const quizId = event.pathParameters.quizId

    if(!quizId){
        return sendError(400, "Quiz id is required in URL")
    }
try {
    const fetchedQuiz = await db.get({
        TableName: "quizes",
        Key: {quizType: "quiz", quizId: quizId}
    })

    if (!fetchedQuiz.Item) {
        return sendError(404, "Quiz not found..")
    }

    return sendResponse(200, "Success", fetchedQuiz.Item)
    
} catch (error) {
    console.error("Error fetching quiz:", error);
    return sendError(500, "Error fetching quiz.");
}

}

module.exports = {handler}