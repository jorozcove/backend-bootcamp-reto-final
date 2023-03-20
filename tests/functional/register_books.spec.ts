import { test } from "@japa/runner"
import { getAuthToken } from "./TestAuths"

test("Regitrar libros", async ({ client, assert }) => {
    const token = await getAuthToken()
    let body = {
        titulo : "las aventuras de un soldado",
        isbn : "0003",
        editorialId : 1,
        autorId : 1,
    }
    const response = await client.post("/api/libros/register")
    .json(body)
    .header("Authorization", `Bearer ${token}`)
    
    response.assertStatus(200)
    assert.isObject(response.body())
})