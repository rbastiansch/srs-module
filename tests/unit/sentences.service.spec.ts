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

    const timeToRepeat = service.calculateTimeToRepeat(payload)

    expect(timeToRepeat.toISO()).toEqual('2022-06-01T00:10:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: wrong there is lastLearningDays', ({ expect }) => {
    const payload = {
      lastLearningDays: 10,
      learning: 'wrong',
      text: 'text wrong',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const timeToRepeat = service.calculateTimeToRepeat(payload)

    expect(timeToRepeat.toISO()).toEqual('2022-06-01T00:10:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: hard and lastLearningDays is null', ({ expect }) => {
    const payload = {
      lastLearningDays: null,
      learning: 'hard',
      text: 'text hard',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const timeToRepeat = service.calculateTimeToRepeat(payload)

    expect(timeToRepeat.toISO()).toEqual('2022-06-02T00:00:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: hard and there is lastLearningDays', ({ expect }) => {
    const payload = {
      lastLearningDays: 3,
      learning: 'hard',
      text: 'text hard',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const timeToRepeat = service.calculateTimeToRepeat(payload)

    expect(timeToRepeat.toISO()).toEqual('2022-06-04T00:00:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: good and lastLearningDays is null', ({ expect }) => {
    const payload = {
      lastLearningDays: null,
      learning: 'good',
      text: 'text good',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const timeToRepeat = service.calculateTimeToRepeat(payload)

    expect(timeToRepeat.toISO()).toEqual('2022-06-03T00:00:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: good there is lastLearningDays', ({ expect }) => {
    const payload = {
      lastLearningDays: 5,
      learning: 'good',
      text: 'text good',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const timeToRepeat = service.calculateTimeToRepeat(payload)

    expect(timeToRepeat.toISO()).toEqual('2022-06-11T00:00:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: easy and lastLearningDays is null', ({ expect }) => {
    const payload = {
      lastLearningDays: null,
      learning: 'easy',
      text: 'text easy',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const timeToRepeat = service.calculateTimeToRepeat(payload)

    expect(timeToRepeat.toISO()).toEqual('2022-06-04T00:00:00.000+00:00')
  })

  test('calculateTimeToRepeat with learning: easy there is lastLearningDays', ({ expect }) => {
    const payload = {
      lastLearningDays: 15,
      learning: 'easy',
      text: 'text easy',
      timeToRepeat: DateTime.fromISO('2022-10-19T00:22:26.052+00:00'),
    }

    const timeToRepeat = service.calculateTimeToRepeat(payload)

    expect(timeToRepeat.toISO()).toEqual('2022-07-09T00:00:00.000+00:00')
  })
})

test.group('calculateRoundedDiffDaysFromNow', () => {
  test('calculateRoundedDiffDaysFromNow returns 0 if there is no more than 12 hours diff', ({
    expect,
  }) => {
    const datetimeMock = DateTime.fromISO('2022-06-01T00:22:26.052+00:00')
    const lastLearningDays = service.calculateRoundedDiffDaysFromNow(datetimeMock)

    expect(lastLearningDays).toEqual(0)
  })

  test('calculateRoundedDiffDaysFromNow returns 1 if there is more than 12 hours diff', ({
    expect,
  }) => {
    const datetimeMock = DateTime.fromISO('2022-06-01T12:22:26.052+00:00')
    const lastLearningDays = service.calculateRoundedDiffDaysFromNow(datetimeMock)

    expect(lastLearningDays).toEqual(1)
  })

  test('calculateRoundedDiffDaysFromNow returns exaclty day if there is less than 12 hours diff', ({
    expect,
  }) => {
    const datetimeMockCase1 = DateTime.fromISO('2022-06-10T00:22:26.052+00:00')
    const lastLearningDaysCase1 = service.calculateRoundedDiffDaysFromNow(datetimeMockCase1)
    const datetimeMockCase2 = DateTime.fromISO('2022-07-10T00:22:26.052+00:00')
    const lastLearningDaysCase2 = service.calculateRoundedDiffDaysFromNow(datetimeMockCase2)
    const datetimeMockCase3 = DateTime.fromISO('2023-01-10T00:22:26.052+00:00')
    const lastLearningDaysCase3 = service.calculateRoundedDiffDaysFromNow(datetimeMockCase3)

    expect(lastLearningDaysCase1).toEqual(9)
    expect(lastLearningDaysCase2).toEqual(39)
    expect(lastLearningDaysCase3).toEqual(223)
  })

  test('calculateRoundedDiffDaysFromNow returns more than one day if there is more than 12 hours diff', ({
    expect,
  }) => {
    const datetimeMockCase1 = DateTime.fromISO('2022-06-10T12:22:26.052+00:00')
    const lastLearningDaysCase1 = service.calculateRoundedDiffDaysFromNow(datetimeMockCase1)
    const datetimeMockCase2 = DateTime.fromISO('2022-07-10T12:22:26.052+00:00')
    const lastLearningDaysCase2 = service.calculateRoundedDiffDaysFromNow(datetimeMockCase2)
    const datetimeMockCase3 = DateTime.fromISO('2023-01-10T12:22:26.052+00:00')
    const lastLearningDaysCase3 = service.calculateRoundedDiffDaysFromNow(datetimeMockCase3)

    expect(lastLearningDaysCase1).toEqual(10)
    expect(lastLearningDaysCase2).toEqual(40)
    expect(lastLearningDaysCase3).toEqual(224)
  })
})
