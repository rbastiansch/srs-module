import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { DateTime } from 'luxon'

export default class Sentences extends BaseSchema {
  protected tableName = 'sentences'

  public async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    this.schema.createTable(this.tableName, (table) => {
      const now = DateTime.now()
      table.uuid('id').primary()
      table.text('text').notNullable()
      table.timestamp('created_at').defaultTo(now)
      table.timestamp('updated_at').defaultTo(now)
      table.timestamp('time_to_repeat')
      table.integer('last_learning_days')
      table
        .uuid('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
    this.schema.dropTable(this.tableName)
  }
}
