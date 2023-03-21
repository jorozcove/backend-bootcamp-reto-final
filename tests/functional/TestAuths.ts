import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export async function getAuthToken(): Promise<string> {
    let endpoint = '/api/v1/login'
    let body = {
        "email": "juanPerez@gmail.com",
        "password": "1234"
      }
    let axiosResponse = await axios.post(Env.get('PATH_APP') + endpoint, body)
    return axiosResponse.data['token']
}