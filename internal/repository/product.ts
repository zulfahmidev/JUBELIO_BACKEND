import { getDB } from "../../pkg/database/database";
import { Pagination } from "../../pkg/rest/pagination";
import type { CreateProductDTO, GetListProductDTO, UpdateProductDTO } from "../dto/product";
import ProductModel from "../model/product";

export default class ProductRepository {

    async findOne(id: number): Promise<ProductModel | null> {
        const db = getDB()

        const row = await db.oneOrNone(`
            SELECT * FROM products WHERE id = $1
        `, id)

        return row ? new ProductModel(row) : null
    }

    async findOneBySKU(sku: string): Promise<ProductModel | null> {
        const db = getDB()
        const row = await db.oneOrNone(`
            SELECT * FROM products WHERE sku = $1
        `, sku)

        return row ? new ProductModel(row) : null
    }

    async findAll(filter: GetListProductDTO): Promise<{ items: ProductModel[]; count: number }> {
        const db = getDB();
        const pg = new Pagination(filter);

        const searchSql = `
            (title ILIKE '%$(search:value)%' OR sku ILIKE '%$(search:value)%')
        `;

        const countRow = await db.one(`
            SELECT COUNT(*) AS total
            FROM products
            WHERE ${searchSql}
        `, { search: pg.search } );

        const count = parseInt(countRow.total, 10);

        const rows = await db.any(`
            SELECT *
            FROM products
            WHERE ${searchSql}
            ORDER BY $(order:raw) $(sort:raw)
            OFFSET $(offset) LIMIT $(limit)
        `, {
            search: pg.search,
            offset: pg.getOffset(),
            limit: pg.limit,
            order: pg.order,
            sort: pg.sort,
        });

        return {
            items: rows.map((row: any) => new ProductModel(row)),
            count,
        };
    }

    async create(data: CreateProductDTO): Promise<ProductModel> {
        const db = getDB()
        const row = await db.one(`
            INSERT INTO products(title, sku, price, description, image)
            VALUES($1, $2, $3, $4, $5) RETURNING *
        `, [data.title, data.sku, data.price, data.description, data.image]);

        return new ProductModel(row);
    }

    async update(id: number, data: UpdateProductDTO): Promise<ProductModel> {
        const db = getDB()
        const row = await db.one(`
            UPDATE products
            SET title = COALESCE($2, title),
                price = COALESCE($3, price),
                description = COALESCE($4, description),
                sku = COALESCE($5, sku),
                image = COALESCE($6, image),
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `, [id, data.title, data.price, data.description, data.sku, data.image]);

        return new ProductModel(row);
    }

    async delete(id: number): Promise<boolean> {
        const db = getDB();
        const result = await db.result(
            `DELETE FROM products WHERE id = $1`,
            [id]
        );

        return result.rowCount > 0;
    }

}