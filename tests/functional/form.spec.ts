import { test } from "@japa/runner"
import { getAuthToken } from './TestAuths'
import User from 'App/Models/User'
import Answer from 'App/Models/Answer'

//GET QUESTIONS (NEED AUTH)

test('FormsController.getQuestions', async ({client , assert}) => {
    let endpoint = "api/v1/form/getQuestions"

    const token = await getAuthToken()
    const response = await client.get(endpoint)
        .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isObject(response.body())
})

//POST QUESTIONS (NEED AUTH)

test('FormsController.postQuestions', async ({client , assert}) => {
    let endpoint = "api/v1/form/postQuestions"
    let body = {
        "estudianteId": 2,
        "answers": [23, 38]
    }

    const check_user = await User.findBy('id', 2)
    let check_answers = true
    for(let answer_id of body.answers){
        if(!await Answer.findBy('id', answer_id)){
            check_answers = false
            break
        }
    }

    if (check_user && check_answers){
        const token = await getAuthToken()
        const response = await client.post(endpoint)
            .form(body)
            .header('Authorization', `Bearer ${token}`)

        response.assertStatus(200)
        assert.isObject(response.body())
    }
})