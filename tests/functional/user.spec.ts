import { test } from '@japa/runner'
import { getAuthToken } from './TestAuths'
import User from 'App/Models/User'

//REGISTER

test('UsersController.register', async ({client , assert}) => {
    let endpoint = "api/v1/user/create"
    let body = {
        "firstName": "Juan",
        "secondName": "Perez",
        "surname": "Perez",
        "secondSurName": "Perez",
        "TypesDocument": 1,
        "documentNumber": "123456789",
        "email": "juanPerez@gmail.com",
        "password": "1234",
        "rol": 1,
        "phone": "123456789"
    }

    const check_user = await User.findBy('email', body.email)

    if(!check_user){
        const response = await client.post(endpoint).form(body)
        response.assertStatus(200)
        assert.isObject(response.body())
    }
    
})

// //LOGIN

//Existing user and correct password
test('UsersController.login', async ({client , assert}) => {
    let endpoint = "api/v1/login"
    let body = {
        email: "juanPerez@gmail.com",
        password: "1234"
    }
    const response = await client.post(endpoint).form(body)
    response.assertStatus(200)

    assert.isObject(response.body())
})

//Non existent user
test('UsersController.login', async ({client , assert}) => {
    let endpoint = "api/v1/login"
    let body = {
        email: "random@gmail.com",
        password: "0987"
    }
    const response = await client.post(endpoint).form(body)
    response.assertStatus(400)

    assert.isObject(response.body())
})

//Wrong password
test('UsersController.login', async ({client , assert}) => {
    let endpoint = "api/v1/login"
    let body = {
        email: "anaMorales@gmail.com",
        password: "1234"
    }
    const response = await client.post(endpoint).form(body)
    response.assertStatus(400)

    assert.isObject(response.body())
})

//GET USERS (NEED AUTH)

test('UsersController.getUsers', async ({client , assert}) => {
    let endpoint = "api/v1/user/getUsers"
    const token = await getAuthToken()
    const response = await client.get(endpoint)
        .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isObject(response.body())
})


//GET USER (NEED AUTH)

//Existing user
test('UsersController.getUser', async ({client , assert}) => {
    let endpoint = "api/v1/user/getUser/1"
    const token = await getAuthToken()
    const response = await client.get(endpoint)
        .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isObject(response.body())
})

//Non existent user
test('UsersController.getUser', async ({client , assert}) => {
    let endpoint = "api/v1/user/getUser/100"
    const token = await getAuthToken()
    const response = await client.get(endpoint)
        .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
    assert.isObject(response.body())
})


//UPDATE USER (NEED AUTH)

test('UsersController.updateUser', async ({client , assert}) => {
    let endpoint = "api/v1/user/update/1"
    let body = {
        "firstName": "JUAN", //Change name
        "secondName": "Perez",
        "surname": "Perez",
        "secondSurName": "Perez",
        "TypesDocument": 1,
        "documentNumber": "123456789",
        "email": "juanPerez@gmail.com",
        "password": "1234",
        "rol": 1,
        "phone": "123456789"
    }

    const check_user = await User.findBy('email', body.email)

    if(check_user){
        const token = await getAuthToken()
        const response = await client.put(endpoint)
            .form(body)
            .header('Authorization', `Bearer ${token}`)
            
        response.assertStatus(200)
        assert.isObject(response.body())
    }
})