import { test } from "@japa/runner"
import { getAuthToken } from './TestAuths'
import Answer from 'App/Models/Answer'
import Question from 'App/Models/Question'

test('AnswersController.listAnswers', async ({client , assert}) => {
    let endpoint = "api/v1/question/getOptions/7"

    const check_question = await Question.findBy('id', 7)
    if(check_question){

        const token = await getAuthToken()
        const response = await client.get(endpoint)
            .header('Authorization', `Bearer ${token}`)

        response.assertStatus(200)
        assert.isObject(response.body())
    }
})

//UPDATE ANSWER (NEED AUTH)

test('AnswersController.updateAnswerById', async ({client , assert}) => {
    let endpoint = "api/v1/question/updateAnswer/23"
    let body = {
        "option": "EUROPA",
        "iscorrect": true
    }

    const check_question = await Answer.findBy('id', 23)
    if(check_question){
        const token = await getAuthToken()
        const response = await client.put(endpoint)
            .form(body)
            .header('Authorization', `Bearer ${token}`)

        response.assertStatus(200)
        assert.isObject(response.body())
    }
})