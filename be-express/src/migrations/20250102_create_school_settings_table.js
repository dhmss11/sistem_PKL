/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  const exists = await knex.schema.hasTable("school_settings");
  if (!exists) {
    return await knex.schema.createTable("school_settings", (table) => {
      table.bigIncrements("id").primary();
      table.string("school_name", 255).notNullable();
      table.string("school_abbreviation", 50);
      table.text("school_address");
      table.string("school_phone", 50);
      table.string("school_email", 100);
      table.text("school_logo_url");
      table.string("website", 255);
      table.string("kepala_sekolah", 255);
      table.string("npsn", 50);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  return knex.schema.dropTableIfExists("school_settings");
};
