import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TypeDocument from 'App/Models/TypeDocument';

export default class TypesDocumentsController {
    public createTypeDocument({request, response}: HttpContextContract){
        try{
            const {name} = request.all();
            const typeDocument = new TypeDocument();
            typeDocument.name = name;
            typeDocument.state = true;
            typeDocument.save();

            return response.status(200).json({
                "state": true,
                "message": "typeDocument creado exitosamente"
            })

        }catch(e){
            console.log(`e -> ${e}`)
            return response.status(500).json({
                "state": false,
                "message": "Error al crear el typeDocument"
            })
        }
    }

    public async getTypesDocuments({response}: HttpContextContract){
        try{
            const typesDocuments = await TypeDocument.query().select('id','name').where({})
            return response.status(200).json({
                state: true,
                typesDocuments,
                message: "Listado de typesDocuments"
            }) 
        } catch (error) {
            return response.status(500).json({
                state: false,
                message: "Error al listar typesDocuments"
            })
        }
    }

    public async updateTypeDocument({request, response}: HttpContextContract){
        try {
            const id = request.param('id_typeDocument')
            const data = request.all()
            await TypeDocument.query().where('id', id).update(data)
            return response.status(200).json({
                state: true,
                message: "typeDocument editado con exito"
            })
        } catch (error) {
            return response.status(500).json({
                state: false,
                message: "Error al actualizar typeDocument"
            })
        }
    }

    public async deleteTypeDocument({request, response}: HttpContextContract){
        try {
            const id = request.param('id_typeDocument')
            await TypeDocument.query().where('id', id).delete()
            return response.status(200).json({
                state: true,
                message: "typeDocument eliminado con exito"
            })
        } catch (error) {
            return response.status(500).json({
                state: false,
                message: "Error al eliminar typeDocument"
            })
        }
    }
}
