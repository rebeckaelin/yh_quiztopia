const checkQuestionData = async (quizname, questions) => {

    if (!quizname || quizname.trim() === "") {
        throw new Error ("Quizname is required.")}

    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error ("Questions must be a non-empty array.")
    }

    for (const question of questions) {
        if (!question.question || question.question.trim() === "" || 
            !question.answer || question.answer.trim() === "" || 
            !question.location) {
            throw new Error ("Each question must have a non-empty question, answer, and a valid location.")
        }
    }
}
module.exports = { checkQuestionData}