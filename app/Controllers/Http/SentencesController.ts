import Sentence from 'App/Models/Sentence'
import Service from 'App/Services/SentencesService'
import { DateTime } from 'luxon'

export default class SentencesController {
  public async index() {
    return await Sentence.all()
  }

  public async store({ request, response }) {
    const sentence = new Sentence()

    const sentenceWithTimeToRepeat = await new Service().addSentenceCurrentTimeToRepeat(
      request.all()
    )
    const result = await sentence.fill({ ...sentenceWithTimeToRepeat }).save()

    response.send(result)
  }

  public async update({ request, response }) {
    const { id } = request.params()
    const sentence = await Sentence.findOrFail(id)

    const updatedSentence = new Service().updateSentenceBasedOnDate({
      ...request.all(),
      timeToRepeat: sentence.timeToRepeat,
      lastLearningDays: sentence.lastLearningDays
    })
    const result = await sentence.merge({ ...updatedSentence }).save()

    response.send(result)
  }

  public async getDelayedSentences() {
    return await Sentence.query().where('timeToRepeat', '<', DateTime.now().toISO())
  }
}
