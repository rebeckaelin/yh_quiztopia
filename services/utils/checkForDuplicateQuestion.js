const checkForDuplicateQuestion = async (existingQuestions, newQuestions) => {

    for (const newQuestion of newQuestions) {
        const duplicatedQuestion = existingQuestions.find(q => q.question.trim().toLowerCase()=== newQuestion.question.trim().toLowerCase())

        if(duplicatedQuestion) {
            throw new Error ("The question already exists in your quiz.")
        }
    }
}

module.exports = {checkForDuplicateQuestion}