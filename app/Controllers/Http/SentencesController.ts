import Sentence from 'App/Models/Sentence'
import Service from 'App/Services/SentencesService'
import { DateTime } from 'luxon'

export default class SentencesController {
  public async index({ auth }) {
    await auth.use('api').authenticate()

    const { id } = auth.use('api').user!

    return await Sentence.query().where({ userId: id })
  }

  public async store({ auth, request, response }) {
    await auth.use('api').authenticate()
    const { id } = auth.use('api').user!

    const sentenceWithTimeToRepeat = await new Service().addSentenceCurrentTimeToRepeat(
      request.all()
    )
    const result = await new Sentence().fill({ ...sentenceWithTimeToRepeat, userId: id }).save()

    response.send(result)
  }

  public async update({ auth, request, response }) {
    await auth.use('api').authenticate()
    const { id: userId } = auth.use('api').user!

    const { id } = request.params()
    const sentence = await Sentence.query().where({ id, userId }).firstOrFail()

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
