import Sentence from 'App/Models/Sentence'
import Service from 'App/Services/SentencesService'
import { DateTime } from 'luxon'

interface SaveSentencePayload {
  text: string
  user_id: string
  timeToRepeat: DateTime
}

interface UpdateSentencePayload extends SaveSentencePayload {
  learning: string
  lastLearningDays: number
}

export default class SentencesController {
  public async index() {
    return await Sentence.all()
  }

  public async store({ request, response }) {
    const sentence = new Sentence()

    const sentenceWithTimeToRepeat = await this.addSentenceTimeToRepeat(request.all())

    const result = await sentence.fill({ ...sentenceWithTimeToRepeat }).save()

    response.send(result)
  }

  public async update({ request, response }) {
    const { id } = request.params()

    const sentence = await Sentence.findOrFail(id)
    const updatedSentence = await this.updateSentenceBasedOnDate({
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

  private async addSentenceTimeToRepeat(payload: SaveSentencePayload) {
    return {
      ...payload,
      timeToRepeat: DateTime.now()
    }
  }

  private async updateSentenceBasedOnDate(payload: UpdateSentencePayload) {
    const { learning, ...payloadCopy } = payload
    const calculatedTimeToRepeat = new Service().calculateTimeToRepeat(payload)
    const lastLearningDays = new Service().calculateRoundedDiffDaysFromNow(calculatedTimeToRepeat)

    return {
      ...payloadCopy,
      timeToRepeat: calculatedTimeToRepeat,
      lastLearningDays
    }
  }
}
