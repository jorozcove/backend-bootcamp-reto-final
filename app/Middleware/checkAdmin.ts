import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from 'App/Controllers/Http/UsersController'
import User from 'App/Models/User'

export default class CheckAdmin {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const authorizationHeader: any = ctx.request.header('authorization')      

    if (!authorizationHeader) {
      return ctx.response.status(401).json({
        msj: 'Falta token de autenticación'
      })
    }

    try{
      const usersController = new UsersController()
      const {id} = await usersController.getPayload(authorizationHeader)  
      const user = await User.find(id) 

      if(!user){
        return ctx.response.status(401).json({
          msj: 'Token no válido'
        })
      }
  
      if( user.rol_id != 1){
        return ctx.response.status(401).json({
          msj: 'No tiene permisos para acceder a esta ruta'
        })
      }
      await next()
    }catch(error){            
      console.log(error);
      ctx.response.status(400).json({"msj": "Token no valido"})
    }    
  }
}
