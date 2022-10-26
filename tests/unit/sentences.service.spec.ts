import { test } from '@japa/runner'
import SentencesService from 'App/Services/SentencesService'
import { DateTime, Settings } from 'luxon'

const service = new SentencesService()

test.group('calculateTimeToRepeat', () => {
  // Setting default date time
  const expectedNow = DateTime.local(2022, 6, 1, 0, 0, 0)
  Settings.now = () => expectedNow.toMillis()

  test('calculateTimeToRepeat with learning: wrong and lastLearningDays is null', ({ expect }) => {
    const payload = {
      lastLearningDays: null,
      learning: 'wrong',
      text: 'text wrong',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const lastLearning = service.calculateTimeToRepeat(payload)

    expect(lastLearning.toISO()).toEqual('2022-06-01T00:10:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: wrong there is lastLearningDays', ({ expect }) => {
    const payload = {
      lastLearningDays: 10,
      learning: 'wrong',
      text: 'text wrong',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const lastLearning = service.calculateTimeToRepeat(payload)

    expect(lastLearning.toISO()).toEqual('2022-06-01T00:10:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: hard and lastLearningDays is null', ({ expect }) => {
    const payload = {
      lastLearningDays: null,
      learning: 'hard',
      text: 'text hard',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const lastLearning = service.calculateTimeToRepeat(payload)

    expect(lastLearning.toISO()).toEqual('2022-06-02T00:00:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: hard and there is lastLearningDays', ({ expect }) => {
    const payload = {
      lastLearningDays: 3,
      learning: 'hard',
      text: 'text hard',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const lastLearning = service.calculateTimeToRepeat(payload)

    expect(lastLearning.toISO()).toEqual('2022-06-04T00:00:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: good and lastLearningDays is null', ({ expect }) => {
    const payload = {
      lastLearningDays: null,
      learning: 'good',
      text: 'text good',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const lastLearning = service.calculateTimeToRepeat(payload)

    expect(lastLearning.toISO()).toEqual('2022-06-03T00:00:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: good there is lastLearningDays', ({ expect }) => {
    const payload = {
      lastLearningDays: 5,
      learning: 'good',
      text: 'text good',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const lastLearning = service.calculateTimeToRepeat(payload)

    expect(lastLearning.toISO()).toEqual('2022-06-11T00:00:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: easy and lastLearningDays is null', ({ expect }) => {
    const payload = {
      lastLearningDays: null,
      learning: 'easy',
      text: 'text easy',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const lastLearning = service.calculateTimeToRepeat(payload)

    expect(lastLearning.toISO()).toEqual('2022-06-04T00:00:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: easy there is lastLearningDays', ({ expect }) => {
    const payload = {
      lastLearningDays: 15,
      learning: 'easy',
      text: 'text easy',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const lastLearning = service.calculateTimeToRepeat(payload)

    expect(lastLearning.toISO()).toEqual('2022-07-09T00:00:00.000+00:00')
  })
})
