import {test} from "@japa/runner"
import {getAuthToken} from "./TestAuths"

test("Listar libros", async ({client, assert}) => {
    const token = await getAuthToken()
    
    const response = await client.get('/api/libros/listar')
        .header('Authorization', `Bearer ${token}` )

    response.assertStatus(200)
    assert.isArray(response.body())
})
