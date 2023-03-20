import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Answer from 'App/Models/Answer';
import Question from 'App/Models/Question';

export default class AnswersController {
    public async createAnswer(q_id: number, option: string, iscorrect: boolean){
        console.log()
        try {
            if(await this.validateQuestion(q_id)){
                const answer = new Answer();

                answer.option = option;
                answer.is_correct = iscorrect;
                answer.question_id = q_id;
                answer.state = true;

                await answer.save();
            }else{
                console.log("La pregunta no existe");
                throw new Error("La pregunta no existe");
            }
            
        }
        catch (error) {
            throw new Error(error);
        }
    }

    public async updateAnswer(a_id: number, option: string, iscorrect: boolean){
        try {
            const answer = await Answer.findOrFail(a_id);
            answer.option = option;
            answer.is_correct = iscorrect;
            await answer.save();
        } catch (error) {
            throw new Error(error);
        }
    }

    public async updateAnswerById({request, response}: HttpContextContract){
        try {
            const id = request.param('id_answer')
            const {option, iscorrect} = request.all()
            this.updateAnswer(id, option, iscorrect)
            
            return response.status(200).json({
                state: true,
                message: "Respuesta editada con exito"
            })
        } catch (error) {
            return response.status(500).json({
                state: false,
                message: "Error al editar la respuesta"
            })
        }
    }

    public async listAnswers({response, request}: HttpContextContract){
        try {
            const {question_id} = request.param('id_question')
            const answers = await Answer.query().select('id','option').where({question_id: question_id})
            return response.status(200).json({
                state: true,
                answers: answers,
                message: "Listado de respuestas"
            })
        } catch (error) {
            return response.status(500).json({
                state: false,
                message: "Error al listar las respuestas"
            })
        }
    }


    public async validateQuestion(q_id: number){
        try {
            const question = await Question.findOrFail(q_id);
            if(question.state){
                return true
            }else{
                return false
            }
        } catch (error) {
            return false
        }
    }
}