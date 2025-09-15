import { getDB } from "../../pkg/database/database";
import type { CreateProductDTO, UpdateProductDTO } from "../dto/product";
import ProductModel from "../model/product";

export default class ProductRepository {

    async findOne(id: number) : Promise<ProductModel | null> {
        const db = getDB()
        const row = await db.oneOrNone(`
            SELECT * FROM products WHERE id = $1
        `, id)

        return row ? new ProductModel(row) : null
    }

    async findAll() : Promise<ProductModel[]> {
        const db = getDB()
        const rows: ProductModel[] = await db.any(`
            SELECT * FROM products
        `)

        return rows.map(row => new ProductModel(row))
    }

    async create(data: CreateProductDTO) : Promise<ProductModel> {
        const db = getDB()
        const row = await db.one(`
            INSERT INTO products(title, sku, price, description)
            VALUES($1, $2, $3, $4) RETURNING *
        `, [data.title, data.sku, data.price, data.description]);

        return new ProductModel(row);
    }

    async update(id: number, data: UpdateProductDTO) : Promise<ProductModel> {
        const db = getDB()
        const row = await db.one(`
            UPDATE products
            SET title = COALESCE($2, title),
                price = COALESCE($3, price),
                description = COALESCE($4, description)
            WHERE id = $1
            RETURNING *
        `, [id, data.title, data.price, data.description]);

        return new ProductModel(row);
    }

    async delete(id: number) {
        const db = getDB();
        const result = await db.result(
            `DELETE FROM products WHERE id = $1`,
            [id]
        );

        return result.rowCount > 0;
    }

}