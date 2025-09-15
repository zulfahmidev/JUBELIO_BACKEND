/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
    pgm.createTable("products", {
        id: "id",
        title: { type: 'varchar(100)', notNull: true },
        sku: { type: 'varchar(50)', unique: true, notNull: true },
        price: { type: 'int', notNull: true, default: 0 },
        description: { type: 'text', notNull: true, default: "" },
        created_at: { type: 'timestamptz', notNull: true, default: pgm.func('NOW()') },
        updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('NOW()') },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
    pgm.dropTable("products");
};
