import dayjs from 'dayjs'

interface LastLearningDaysPayload {
  lastLearningDays: number
  learning?: string
}

interface TimeToRepeatPayload {
  timeToRepeat: string
  learning?: string
  lastLearningDays: number
  daysToAdd: number
}

export default class SentencesService {
  public getLastLearningDays(payload: LastLearningDaysPayload): number {
    const { lastLearningDays, learning } = payload
    const learningMinutes = {
      wrong: 10, // 10 minutes = 0,00694444
      difficult: 1, // 1 day
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

  public getTimeToRepeat(payload: TimeToRepeatPayload): string {
    const { timeToRepeat, learning, lastLearningDays, daysToAdd } = payload
    let updatedTimeToRepeat = dayjs().toISOString()
    if (!learning) {
      return updatedTimeToRepeat
    }

    updatedTimeToRepeat =
      learning === 'wrong'
        ? dayjs(timeToRepeat).add(daysToAdd, 'minute').toISOString()
        : dayjs(timeToRepeat)
            .add(lastLearningDays || daysToAdd, 'day')
            .toISOString()

    return updatedTimeToRepeat
  }
}
