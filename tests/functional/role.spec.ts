import { test } from "@japa/runner"
import { getAuthToken } from './TestAuths'
import Role from 'App/Models/Role'

//CREATE ROLE

test('RolesController.createRole', async ({client , assert}) => {
    let endpoint = "api/v1/rol/create"
    let body = {
        name: "TestRole"
    }

    const checkRole = await Role.findBy('name', body.name)
    if(!checkRole){
        const response = await client.post(endpoint)
            .form(body)

        response.assertStatus(200)
        assert.isObject(response.body())
    }
})

//GET ROLES (NEED AUTH)

test('RolesController.getRoles', async ({client , assert}) => {
    let endpoint = "api/v1/rol/getRoles"
    const token = await getAuthToken()
    const response = await client.get(endpoint)
        .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isObject(response.body())
})

//UPDATE ROLE (NEED AUTH)

test('RolesController.updateRole', async ({client , assert}) => {
    let endpoint = "api/v1/rol/updateRol/5"
    let body = {
        name: "TestRole2"
    }

    const checkRole = await Role.findBy('id', 5)
    if(checkRole){
        const token = await getAuthToken()
        const response = await client.put(endpoint)
            .form(body)
            .header('Authorization', `Bearer ${token}`)

        response.assertStatus(200)
        assert.isObject(response.body())
    }
})

//DELETE ROLE (NEED AUTH)

test('RolesController.deleteRole', async ({client , assert}) => {
    let endpoint = "api/v1/rol/deleteRol/5"

    const checkRole = await Role.findBy('id', 5)
    if(checkRole){
        const token = await getAuthToken()
        const response = await client.delete(endpoint)
            .header('Authorization', `Bearer ${token}`)

        response.assertStatus(200)
        assert.isObject(response.body())
    }
})