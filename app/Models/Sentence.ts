import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import User from 'App/Models/User'

export default class Sentence extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @belongsTo(() => User, {
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  @column()
  public text: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public timeToRepeat: DateTime

  @column()
  public lastLearningDays: number

  @beforeCreate()
  public static assignUuid(sentence: Sentence) {
    sentence.id = uuidv4()
  }
}
