import { DateTime } from 'luxon'
import { SentenceLearningLevel } from 'App/Enums/sentences.enum'

interface SentencePayload {
  lastLearningDays: number | null
  learning: string
  text: string
  timeToRepeat: DateTime
}

interface SaveSentencePayload {
  text: string
  user_id: string
  timeToRepeat: DateTime
}

interface UpdateSentencePayload extends SaveSentencePayload {
  learning: string
  lastLearningDays: number
}

export default class SentencesService {
  public addSentenceCurrentTimeToRepeat(payload: SaveSentencePayload) {
    return {
      ...payload,
      timeToRepeat: DateTime.now()
    }
  }

  public updateSentenceBasedOnDate(payload: UpdateSentencePayload) {
    const { learning, ...payloadCopy } = payload
    const calculatedTimeToRepeat = this.calculateTimeToRepeat(payload)
    const lastLearningDays = this.calculateRoundedDiffDaysFromNow(calculatedTimeToRepeat)

    return {
      ...payloadCopy,
      timeToRepeat: calculatedTimeToRepeat,
      lastLearningDays
    }
  }

  private calculateTimeToRepeat(payload: SentencePayload): DateTime {
    const { timeToRepeat, learning, lastLearningDays } = payload
    const { WRONG, HARD, GOOD, EASY } = SentenceLearningLevel

    const calculateConfig = {
      [WRONG]: () => ({ minutes: 10 }),
      [HARD]: () => ({ days: this.calculateDaysToSum(lastLearningDays) }),
      [GOOD]: () => ({ days: this.calculateDaysToSum(lastLearningDays, 2) }),
      [EASY]: () => ({ days: this.calculateDaysToSum(lastLearningDays, 2.5) })
    }

    const matchedLearning = calculateConfig[learning]

    return matchedLearning ? DateTime.now().plus(matchedLearning()) : timeToRepeat
  }

  private calculateRoundedDiffDaysFromNow(timeToRepeat: DateTime): number {
    const current = DateTime.now()
    const diffDays = timeToRepeat.diff(current, 'days')

    return Math.round(diffDays.toObject().days || 0)
  }

  private calculateDaysToSum(lastLearningDays: number | null, timesToCalculate?: number): number {
    const daysToSum = lastLearningDays || 1
    if (!timesToCalculate) {
      return daysToSum
    }

    return Math.ceil(daysToSum * timesToCalculate)
  }
}
