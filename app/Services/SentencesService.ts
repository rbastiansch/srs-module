import { DateTime } from 'luxon'

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
    if (learning === 'wrong') {
      return DateTime.now().plus({ minutes: 10 })
    }

    if (learning === 'hard') {
      const daysToSum = lastLearningDays || 1
      return DateTime.now().plus({ days: daysToSum })
    }

    if (learning === 'good') {
      const daysToSum = lastLearningDays || 1
      return DateTime.now().plus({ days: daysToSum * 2 })
    }

    if (learning === 'easy') {
      const daysToSum = lastLearningDays || 1
      const roundedDays = Math.ceil(daysToSum * 2.5)
      return DateTime.now().plus({ days: roundedDays })
    }

    return timeToRepeat
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

  public getTimeToRepeat(payload: TimeToRepeatPayload): DateTime {
    const { timeToRepeat, learning, lastLearningDays, daysToAdd } = payload
    let updatedTimeToRepeat = DateTime.now()
    if (!learning) {
      return updatedTimeToRepeat
    }

    updatedTimeToRepeat =
      learning === 'wrong'
        ? DateTime.fromISO(timeToRepeat).plus({ minutes: daysToAdd })
        : DateTime.fromISO(timeToRepeat).plus({ days: lastLearningDays || daysToAdd })

    return updatedTimeToRepeat
  }
}
