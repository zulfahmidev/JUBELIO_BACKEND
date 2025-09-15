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
    pgm.createTable("products", {
        id: "id",
        title: { type: 'varchar(100)', notNull: true },
        sku: { type: 'varchar(50)', unique: true, notNull: true },
        price: { type: 'int', notNull: true, default: 0 },
        description: { type: 'text', notNull: true, default: "" },
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("products")
};
