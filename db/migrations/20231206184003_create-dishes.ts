import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('dishes', (table) => {
        table.uuid('id').primary
        table.uuid('user_id')
        table.string('name')
        table.string('description')
        table.timestamp('time')
        table.boolean('in_diet')
    })   
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('dishes')
}

