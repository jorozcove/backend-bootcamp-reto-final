import { test } from "@japa/runner"
import { getAuthToken } from './TestAuths'
import Question from 'App/Models/Question'

//CREATE QUESTION (NEED AUTH)

test('QuestionsController.createQuestion', async ({client , assert}) => {
    let endpoint = "api/v1/question/create"
    let body = {
        "question": "TestQuestion",
        "options": [
            {
                "option": "TestOption1",
                "iscorrect": true
            },
            {
                "option": "TestOption2",
                "iscorrect": false
            },
            {
                "option": "TestOption3",
                "iscorrect": false
            },
            {
                "option": "TestOption4",
                "iscorrect": false
            }
        ]
    }

    const check_question = await Question.findBy('question', body.question)
    if(!check_question){

        const token = await getAuthToken()
        const response = await client.post(endpoint)
            .form(body)
            .header('Authorization', `Bearer ${token}`)

        response.assertStatus(200)
        assert.isObject(response.body())
    }
})

//GET QUESTIONS (NEED AUTH)

test('QuestionsController.getQuestions', async ({client , assert}) => {
    let endpoint = "api/v1/question/getQuestions"

    const token = await getAuthToken()
    const response = await client.get(endpoint)
        .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isObject(response.body())
})

//DELETE QUESTION (NEED AUTH)

test('QuestionsController.deleteQuestion', async ({client , assert}) => {
    let endpoint = "api/v1/question/deleteQuestion/14"

    const check_question = await Question.findBy('id', 14)
    if(check_question){
        const token = await getAuthToken()
        const response = await client.delete(endpoint)
            .header('Authorization', `Bearer ${token}`)

        response.assertStatus(200)
        assert.isObject(response.body())
    }
})

//UPDATE QUESTION (NEED AUTH)

test('QuestionsController.updateQuestion', async ({client , assert}) => {
    let endpoint = "api/v1/question/updateQuestion/10"
    let body = {
        "question": "TestQuestionUpdate"
    }

    const check_question = await Question.findBy('id', 10)
    if(check_question){
        const token = await getAuthToken()
        const response = await client.put(endpoint)
            .form(body)
            .header('Authorization', `Bearer ${token}`)

        response.assertStatus(200)
        assert.isObject(response.body())
    }
})