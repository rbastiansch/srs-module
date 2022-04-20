import Sentence from 'App/Models/Sentence'

export default class SentencesController {
  public async index() {
    return await Sentence.all()
  }

  public async store({ request, response }) {
    const sentence = new Sentence()

    const result = await sentence.fill({ ...request.all() }).save()

    response.send(result)
  }

  public async update({ request, response }) {
    const { id } = request.params()

    const sentence = await Sentence.findOrFail(id)
    const result = await sentence.merge({ ...request.all() }).save()

    response.send(result)
  }
}
