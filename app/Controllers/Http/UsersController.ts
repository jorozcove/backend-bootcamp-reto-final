import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
const bcryptjs = require('bcryptjs')

export default class UsersController {
    public async register({request, response}: HttpContextContract){
      try{
        const {firstName , secondName, surname, secondSurName, typeDocument, documentNumber, email, password, rol, phone} = request.all();

        //check if the user exists
        const check_user = await User.findBy('email', email)
        if (check_user) {
          return response.status(500).json({
            "state": false,
            "message": "El usuario ya existe"
          })
        }

        const user = new User();
        user.first_name = firstName;
        user.second_name = secondName;
        user.surname = surname;
        user.second_sur_name = secondSurName;
        user.type_document = typeDocument;
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
        console.log(error)
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
    //     "typeDocument": "CC",
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
          const users = await User.query().select('first_name','second_name','surname','second_sur_name','type_document','document_number','email','phone','rol_id').where({})
          console.log(users)
          let usersData : Object[] = []

          for(let user of users){
            const userData = {
              firstName: user.first_name,
              secondName: user.second_name,
              surname: user.surname,
              secondSurName: user.second_sur_name,
              typeDocument: user.type_document,
              documentNumber: user.document_number,
              email: user.email,
              phone: user.phone,
              rol: user.rol_id,
            }

            usersData.push(userData)
          }

          return response.status(200).json({
            state: true,
            users: usersData,
            message: "Listado de estudiantes"
          })
        } catch (error) {
          console.log(error)
          return response.status(500).json({
            state: false,
            message: "Fallo en el listado de estudiantes"
          })
        }
      }

      public async getUser({request, response}: HttpContextContract){
        try {
          const id = request.param('id_user')

          const user = await User.query().select('first_name','second_name','surname','second_sur_name','type_document','document_number','email','phone','rol_id').where('id', id)

          if (user.length > 0){

            const userData = {
              firstName: user[0].first_name,
              secondName: user[0].second_name,
              surname: user[0].surname,
              secondSurName: user[0].second_sur_name,
              typeDocument: user[0].type_document,
              documentNumber: user[0].document_number,
              email: user[0].email,
              phone: user[0].phone,
              rol: user[0].rol_id,
            }

            return response.status(200).json({
              state: true,
              user: userData,
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

          const update_data = {}
          const pass = data.password
          const salt = bcryptjs.genSaltSync();
          update_data['password'] = bcryptjs.hashSync( pass, salt );

          update_data['first_name'] = data.firstName
          update_data['second_name'] = data.secondName
          update_data['surname'] = data.surname
          update_data['second_sur_name'] = data.secondSurName
          update_data['type_document'] = data.typeDocument
          update_data['document_number'] = data.documentNumber
          update_data['email'] = data.email
          update_data['phone'] = data.phone

          await User.query().where('id', id).update(update_data)
          return response.status(200).json({
            state: true,
            message: "Se actualizo correctamente"
          })
        } catch (error) {
          console.log(error)
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
