import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/role';

export default class rolesController {
    public async createRole({request, response}: HttpContextContract){
        try{
            const {name} = request.all();
            console.log(name)
            const role = new Role();
            role.name = name;
            role.state = true;
            await role.save();

            return response.status(200).json({
                "state": true,
                "message": "role creado exitosamente"
            })

        }catch(e){
            console.log(e)
            return response.status(500).json({
                "state": false,
                "message": "Error al crear el rol"
            })
        }
    }

    public async getRoles({response}: HttpContextContract){
        try{
            const roles = await Role.query().select('id','name').where({})
            return response.status(200).json({
                state: true,
                roles,
                message: "Listado de roles"
            }) 
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                state: false,
                message: "Error al listar roles"
            })
        }
    }

    public async updateRole({request, response}: HttpContextContract){
        try {
            const id = request.param('id_role')
            const data = request.all()
            await Role.query().where('id', id).update(data)
            return response.status(200).json({
                state: true,
                message: "Rol editado con exito"
            })
        } catch (error) {
            return response.status(500).json({
                state: false,
                message: "Error al actualizar Rol"
            })
        }
    }

    public async deleteRole({request, response}: HttpContextContract){
        try {
            const id = request.param('id_role')
            await Role.query().where('id', id).delete()
            return response.status(200).json({
                state: true,
                message: "Rol eliminado con exito"
            })
        } catch (error) {
            return response.status(500).json({
                state: false,
                message: "Error al eliminar Rol"
            })
        }
    }
}
