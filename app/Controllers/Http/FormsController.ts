import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Form from 'App/Models/Form';
import Question from 'App/Models/Question'
import Answer from 'App/Models/Answer';

interface question {
    id: number,
    question: string,
    options: Answer[]
}

export default class FormsController {
    public async getQuestions({response}: HttpContextContract){
        try{
            const questions = await Question.query().select('id','question').where({state: true})
            
            let q_obj : question[] = []

            for (let question of questions) {
                let options = await Answer.query().select('id','option',).where({question_id: question.id})
                
                q_obj.push({
                    id : question.id,
                    question : question.question,
                    options : options
                })
            }
            
            return response.status(200).json({
                state: true,
                questions: q_obj,
                message: "Listado de preguntas"
            })

        } catch (error) {
            return response.status(500).json({
                state: false,
                message: "Error al listar las preguntas"
            })   
        }
    }

    public async postQuestions({request,response}: HttpContextContract){
        try {
            const {estudianteId, answers} = request.all()
            console.log(estudianteId)
            for(let answer_id of answers){
                await Form.create({
                    student_id: estudianteId,
                    answer_id: answer_id,
                    state: true
                })
            }
            return response.status(200).json({
                state: true,
                message: "Respuestas guardadas con exito"
            })
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                state: false,
                message: "No se pudieron almacenar las respuestas"
            })
        }
    }

}
