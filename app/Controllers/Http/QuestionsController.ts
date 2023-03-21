import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Question from 'App/Models/Question';
import AnswersController from './AnswersController';
import Answer from 'App/Models/Answer';

export default class QuestionsController {
    public async createQuestion({request, response}: HttpContextContract){
        try{
            const {question, options} = request.all();
            const questionModel = new Question();

            questionModel.question = question;
            questionModel.state = true;

            await questionModel.save();

            const q_id = questionModel.id
            console.log(q_id)
            
            const answersController = new AnswersController();
            for (let option of options) {
                console.log(option)
                await answersController.createAnswer(q_id, option.option, option.iscorrect)
            }

            return response.status(200).json({
                "state": true,
                "message": "Pregunta creada exitosamente"
            })

        }catch(e){
            return response.status(500).json({
                "state": false,
                "message": "Error al crear la pregunta"
            })
        }
    }

    public async getQuestions({response}: HttpContextContract){
        try{
            const questions = await Question.query().select('id','question').where({state: true})
            
            return response.status(200).json({
                state: true,
                questions,
                message: "Listado de preguntas"
            })

        } catch (error) {
            return response.status(500).json({
                state: false,
                message: "Error al listar las preguntas"
            })   
        }
    }

    public async deleteQuestion({request, response}: HttpContextContract){
        try {
            const id = request.param('id_question')
            
            await Question.findOrFail(id)

            await Question.query().delete().where({id: id})
            await Answer.query().delete().where({question_id: id})

            return response.status(200).json({
                state: true,
                message: "Pregunta eliminada con exito"
            })
        } catch (error) {
            return response.status(500).json({
                state: false,
                message: "Error al eliminar la pregunta"
            })
        }
            
    }

    public async updateQuestion({request, response}: HttpContextContract){
        try {
            const id = request.param('id_question')
            const {question} = request.all()

            const questionModel = await Question.findOrFail(id)
            questionModel.question = question;

            await questionModel.save();

            return response.status(200).json({
                "state": true,
                "message": "Pregunta editada con exito"
            })

        } catch (error) {
            return response.status(500).json({
                "state": false,
                "message": "Error al editar la pregunta"
            })
        }
    }


    
}
