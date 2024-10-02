const {db} = require("../data/db");
const { getQuizById } = require("../utils/getQuizWithId");
const {sendResponse, sendError} = require("../utils/responses");


const handler = async (event) => {
    const quizId = event.pathParameters.quizId

    if(!quizId){
        return sendError(400, "Quiz id is required in URL")
    }
try {
    await getQuizById("quiz", quizId)

    return sendResponse(200, "Success", fetchedQuiz.Item)
    
} catch (error) {
    console.error("Error fetching quiz:", error);
    return sendError(500, "Error fetching quiz.");
}

}

module.exports = {handler}