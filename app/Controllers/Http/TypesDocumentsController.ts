import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TypesDocument from 'App/Models/TypesDocument';

export default class TypesDocumentsController {
    public createTypesDocument({request, response}: HttpContextContract){
        try{
            const {name} = request.all();
            const TypesDocumentModel = new TypesDocument();
            TypesDocumentModel.name = name;
            TypesDocumentModel.state = true;
            TypesDocumentModel.save();

            return response.status(200).json({
                "state": true,
                "message": "TypesDocument creado exitosamente"
            })

        }catch(e){
            console.log(`e -> ${e}`)
            return response.status(500).json({
                "state": false,
                "message": "Error al crear el TypesDocument"
            })
        }
    }

    public async getTypesDocuments({response}: HttpContextContract){
        try{
            const typesDocuments = await TypesDocument.query().select('id','name').where({})
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

    public async updateTypesDocument({request, response}: HttpContextContract){
        try {
            const id = request.param('id_TypesDocument')
            const data = request.all()
            await TypesDocument.query().where('id', id).update(data)
            return response.status(200).json({
                state: true,
                message: "TypesDocument editado con exito"
            })
        } catch (error) {
            return response.status(500).json({
                state: false,
                message: "Error al actualizar TypesDocument"
            })
        }
    }

    public async deleteTypesDocument({request, response}: HttpContextContract){
        try {
            const id = request.param('id_TypesDocument')
            await TypesDocument.query().where('id', id).delete()
            return response.status(200).json({
                state: true,
                message: "TypesDocument eliminado con exito"
            })
        } catch (error) {
            return response.status(500).json({
                state: false,
                message: "Error al eliminar TypesDocument"
            })
        }
    }
}
