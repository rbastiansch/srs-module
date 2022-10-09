import { test } from '@japa/runner'
import SentencesService from 'App/Services/SentencesService'

const service = new SentencesService()

test('getLastLearningDays', ({ expect }) => {
  const obj = {
    lastLearningDays: null,
    learning: 'wrong',
  }
  const lastLearning = service.getLastLearningDays(obj)

  expect(lastLearning).toBe('')
})
