import Sentence from 'App/Models/Sentence'
import Service from 'App/Services/SentencesService'
import dayjs from 'dayjs'

interface SaveSentencePayload {
  text: string
  timeToRepeat: string
}

interface UpdateSentencePayload extends SaveSentencePayload {
  learning?: string
  lastLearningDays: number
}

export default class SentencesController {
  public async index() {
    return await Sentence.all()
  }

  public async store({ request, response }) {
    const sentence = new Sentence()

    const timeToRepeat = await this.saveSentenceBasedOnDate(request.all())

    const result = await sentence.fill({ ...timeToRepeat }).save()

    response.send(result)
  }

  public async update({ request, response }) {
    const { id } = request.params()

    const sentence = await Sentence.findOrFail(id)
    const timeToRepeat = await this.updateSentenceBasedOnDate({
      ...request.all(),
      timeToRepeat: sentence.timeToRepeat,
      lastLearningDays: sentence.lastLearningDays,
    })

    const result = await sentence.merge({ ...timeToRepeat }).save()
    response.send(result)
  }

  private async saveSentenceBasedOnDate(payload: SaveSentencePayload) {
    return {
      ...payload,
      timeToRepeat: dayjs().toISOString(),
    }
  }

  private async updateSentenceBasedOnDate(payload: UpdateSentencePayload) {
    const { timeToRepeat, learning, lastLearningDays } = payload

    const lastLearningDaysNew = new Service().getLastLearningDays({ lastLearningDays, learning })
    const timeToRepeatNew = new Service().getTimeToRepeat({
      timeToRepeat,
      learning,
      daysToAdd: 1,
      lastLearningDays: lastLearningDaysNew,
    })

    if (learning) {
      delete payload.learning
    }

    return {
      ...payload,
      timeToRepeat: timeToRepeatNew,
      lastLearningDays: lastLearningDaysNew,
    }
  }
}
