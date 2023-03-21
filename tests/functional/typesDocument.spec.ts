import { test } from "@japa/runner"
import { getAuthToken } from './TestAuths'
import TypesDocument from 'App/Models/TypesDocument'

//CREATE TYPES DOCUMENT

test('TypesDocumentsController.createTypesDocument', async ({client , assert}) => {
    let endpoint = "api/v1/TypesDocument/create"
    let body = {
        name: "TestTypesDocument"
    }

    const checkTypesDocument = await TypesDocument.findBy('name', body.name)
    if(!checkTypesDocument){
        const response = await client.post(endpoint)
            .form(body)

        response.assertStatus(200)
        assert.isObject(response.body())
    }
})

//GET TYPES DOCUMENTS (NEED AUTH)

test('TypesDocumentsController.getTypesDocuments', async ({client , assert}) => {
    let endpoint = "api/v1/TypesDocument/getTypesDocuments"
    const token = await getAuthToken()
    const response = await client.get(endpoint)
        .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isObject(response.body())
})

//UPDATE TYPES DOCUMENT (NEED AUTH)

test('TypesDocumentsController.updateTypesDocument', async ({client , assert}) => {
    let endpoint = "api/v1/TypesDocument/updateTypesDocument/1"
    let body = {
        name: "CC"
    }

    const checkTypesDocument = await TypesDocument.findBy('id', 1)
    if(checkTypesDocument){
        const token = await getAuthToken()
        const response = await client.put(endpoint)
            .form(body)
            .header('Authorization', `Bearer ${token}`)

        response.assertStatus(200)
        assert.isObject(response.body())
    }
})

//DELETE TYPES DOCUMENT (NEED AUTH)

test('TypesDocumentsController.deleteTypesDocument', async ({client , assert}) => {
    let endpoint = "api/v1/TypesDocument/deleteTypesDocument/2"

    const checkTypesDocument = await TypesDocument.findBy('id', 2)
    if(checkTypesDocument){
        const token = await getAuthToken()
        const response = await client.delete(endpoint)
            .header('Authorization', `Bearer ${token}`)

        response.assertStatus(200)
        assert.isObject(response.body())
    }
})