import { DateTime } from 'luxon'
import { SentenceLearningLevel } from 'App/Enums/sentences.enum'

interface LastLearningDaysPayload {
  lastLearningDays: number
  learning?: string
}

interface TimeToRepeatPayload {
  timeToRepeat: string
  learning?: string
  lastLearningDays: number | null
  daysToAdd: number
}

interface SentencePayload {
  lastLearningDays: number | null
  learning: string
  text: string
  timeToRepeat: DateTime
}

export default class SentencesService {
  public calculateTimeToRepeat(payload: SentencePayload): DateTime {
    const { timeToRepeat, learning, lastLearningDays } = payload
    const { WRONG, HARD, GOOD, EASY } = SentenceLearningLevel

    const calculateConfig = {
      [WRONG]: () => ({ minutes: 10 }),
      [HARD]: () => ({ days: this.calculateDaysToSum(lastLearningDays) }),
      [GOOD]: () => ({ days: this.calculateDaysToSum(lastLearningDays, 2) }),
      [EASY]: () => ({ days: this.calculateDaysToSum(lastLearningDays, 2.5) }),
    }

    const matchedLearning = calculateConfig[learning]

    return matchedLearning ? DateTime.now().plus(matchedLearning()) : timeToRepeat
  }

  public getLastLearningDays(payload: LastLearningDaysPayload): number {
    const { lastLearningDays, learning } = payload
    const learningMinutes = {
      wrong: 10, // 10 minutes = 0,00694444
      hard: 1, // 1 day
      normal: 4, // 4 days
      easy: 7, // 7 days
    }

    if (!learning) {
      return lastLearningDays
    }

    let updatedlastLearningDays = lastLearningDays
    const daysToAdd = learningMinutes[learning]

    if (learning !== 'wrong') {
      updatedlastLearningDays =
        updatedlastLearningDays && learning === 'easy' ? updatedlastLearningDays * 2 : daysToAdd
    }

    return updatedlastLearningDays
  }

  private calculateDaysToSum(lastLearningDays: number | null, timesToCalculate?: number): number {
    const daysToSum = lastLearningDays || 1
    if (!timesToCalculate) {
      return daysToSum
    }

    return Math.ceil(daysToSum * timesToCalculate)
  }
}
