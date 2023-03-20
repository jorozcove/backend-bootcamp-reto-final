import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export async function getAuthToken(): Promise<string> {
    let endpoint = '/api/login'
    let body = {
        "correo": "juanPerez@gmail.com",
        "contrasena": "1234"
      }
    let axiosResponse = await axios.post(Env.get('PATH_APP') + endpoint, body)
    return axiosResponse.data['token']
}