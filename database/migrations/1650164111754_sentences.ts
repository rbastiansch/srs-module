import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { DateTime } from 'luxon'

export default class Sentences extends BaseSchema {
  protected tableName = 'sentences'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      const now = DateTime.now()
      table.increments('id')
      table.text('text').notNullable()
      table.timestamp('created_at').defaultTo(now)
      table.timestamp('updated_at').defaultTo(now)
      table.timestamp('time_to_repeat')
      table.integer('last_learning_days')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
