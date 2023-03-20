import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
const bcryptjs = require('bcryptjs')

export default class UsersController {
    public async register({request, response}: HttpContextContract){
      try{
        const {firstName , secondName, surname, secondSurName, TypesDocument, documentNumber, email, password, rol, phone} = request.all();

        const user = new User();
        user.first_name = firstName;
        user.second_name = secondName;
        user.surname = surname;
        user.second_sur_name = secondSurName;
        user.type_document = TypesDocument;
        user.document_number = documentNumber;
        user.email = email;
        user.rol_id = rol;
        user.phone = phone;

        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync( password, salt );

        user.state = true;
          
        await user.save();

        return response.status(200).json({
          "state": true,
          "message": "Estudiante creado exitosamente"
        })

      } catch (error) {
        return response.status(500).json({
          "state": false,
          "message": "Fallo en la creación del estudiante"
        })
      }
    }

    //example
    // {
    //     "firstName": "Juan",
    //     "secondName": "Perez",
    //     "surname": "Perez",
    //     "secondSurName": "Perez",
    //     "TypesDocument": "CC",
    //     "documentNumber": "123456789",
    //     "email": "juanPerez@gmail.com",
    //     "password": "1234",
    //     "rol": 1,
    //     "phone": "123456789"
    // }

      public async login({request, response}: HttpContextContract){
        const {email, password} = request.all();
        try {
          //Check email
          const user = await User.findBy('email', email)
          if(!user){
            return response.status(400).json({
              state : false,
              message : "El usuario no existe"
            })
          }
          //Check password
          const validPassword = bcryptjs.compareSync( password, user.password );
          if ( !validPassword ) {
            return response.status(400).json({msj: 'constraseña o email invalido '})
          }
          //Check role
          const role = await Role.findBy('id', user.rol_id)
          if(!role){
            return response.status(400).json({
              state : false,
              message : "El rol no existe"
            })
          }
          //Generate token
          const payload = {
            'name': user.first_name,
            'id': user.id,
            'document': user.document_number,
          }
          const token:string = this.generateToken(payload);
    
          response.status(200).json({
            token,
            state: user.state,
            id: user.id,
            name: (user.first_name).concat(" ",user.second_name," ",user.surname," ",user.second_sur_name),
            role: role.name,
            msg: "Ingreso exitoso",
          })

        } catch (error) {
          response.json({
            state: false,
            msg: "Error en el servidor"
          });
        }
      }

      public async getUsers({response}: HttpContextContract){
        try {
          const users = await User.query().select('first_name','second_name','surname','second_sur_name','type_document','document_number','email','phone').where({})
          return response.status(200).json({
            state: true,
            users,
            message: "Listado de estudiantes"
          })
        } catch (error) {
          return response.status(500).json({
            state: false,
            message: "Fallo en el listado de estudiantes"
          })
        }
      }

      public async getUser({request, response}: HttpContextContract){
        try {
          const id = request.param('id_user')

          const user = await User.query().select('first_name','second_name','surname','second_sur_name','type_document','document_number','email','phone').where('id', id)

          console.log(user)

          if (user.length > 0){
            return response.status(200).json({
              state: true,
              user: user[0],
              message: "Estudiante encontrado"
            })
          }

          return response.status(404).json({
            state: false,
            message: "Estudiante no encontrado"
          })

        } catch (error) {
          return response.status(500).json({
            state: false,
            message: "Error al consultar el detalle del usuario"
          })
        }
      }
      
      public async updateUser({request, response}: HttpContextContract){
        try {
          const id = request.param('id_user')
          const data = request.all()
          await User.query().where('id', id).update(data)
          return response.status(200).json({
            state: true,
            message: "Se actualizo correctamente"
          })
        } catch (error) {
          return response.status(500).json({
            state: false,
            message: "Error al actualizar"
          })
        }
      }

      // Aux functions
    
      public generateToken(payload: any):string{
        const options = {
          expiresIn: "20 mins"
        }
        return jwt.sign(payload, Env.get('JWT_SECRET_KEY'), options)    
      }
    
      public verifyToken(authorizationHeader:string){
        let token = authorizationHeader.split(' ')[1]
        jwt.verify(token, Env.get('JWT_SECRET_KEY'), (error)=>{
            if(error){
                throw new Error("Token expirado");
            }
        })
        return true
      }
      
      public getPayload (authorizationHeader:string) {
        let token = authorizationHeader.split(' ')[1]
        return jwt.verify(token, Env.get("JWT_SECRET_KEY"), {complete: true}).payload
      }
}
