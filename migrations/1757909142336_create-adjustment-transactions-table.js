/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("adjustment_transactions", {
        id: "id",
        sku: { type: 'varchar(50)', notNull: true },
        qty: { type: 'int', notNull: true, default: 0 },
        amount: { type: 'int', notNull: true, default: 0 },
        created_at: { type: 'timestamptz', notNull: true, default: pgm.func('NOW()') },
        updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('NOW()') },
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("adjustment_transactions")
};
