import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Sentences extends BaseSchema {
  protected tableName = 'sentences'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('text').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
