import { getDB } from "../../pkg/database/database";
import { Pagination } from "../../pkg/rest/pagination";
import { CreateAdjustmentTransactionDTO, GetListAdjustmentTransactionDTO, UpdateAdjustmentTransactionDTO } from "../dto/adjustment_transaction";
import AdjustmentTransactionModel from "../model/adjustment_transaction";

export default class AdjustmentTransactionRepository {

    async findOne(id: number) : Promise<AdjustmentTransactionModel | null> {
        const db = getDB()
        const row = await db.oneOrNone(`
            SELECT * FROM adjustment_transactions WHERE id = $1
        `, id)

        return row ? new AdjustmentTransactionModel(row) : null
    }

    async findAll(filter: GetListAdjustmentTransactionDTO) : Promise<{items: AdjustmentTransactionModel[], count: number}> {
        const db = getDB();
        const pg = new Pagination(filter);

        const searchSql = `
            (sku ILIKE '%$(search:value)%')
        `;

        const countRow = await db.one(`
            SELECT COUNT(*) AS total
            FROM adjustment_transactions
            WHERE ${searchSql}
        `, { search: pg.search } );

        const count = parseInt(countRow.total, 10);

        const rows = await db.any(`
            SELECT *
            FROM adjustment_transactions
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
            items: rows.map((row: any) => new AdjustmentTransactionModel(row)),
            count,
        };
    }

    async create(data: CreateAdjustmentTransactionDTO) : Promise<AdjustmentTransactionModel> {
        const db = getDB()
        const row = await db.one(`
            INSERT INTO adjustment_transactions(sku, qty, amount)
            VALUES($1, $2, $3) RETURNING *
        `, [data.sku, data.qty, data.amount]);

        return new AdjustmentTransactionModel(row);
    }

    async update(id: number, data: UpdateAdjustmentTransactionDTO) : Promise<AdjustmentTransactionModel> {
        const db = getDB()
        const row = await db.one(`
            UPDATE adjustment_transactions
            SET sku = COALESCE($2, sku),
                qty = COALESCE($3, qty),
                amount = COALESCE($4, amount),
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `, [id, data.sku, data.qty, data.amount]);

        return new AdjustmentTransactionModel(row);
    }

    async delete(id: number) : Promise<boolean> {
        const db = getDB();
        const result = await db.result(
            `DELETE FROM adjustment_transactions WHERE id = $1`,
            [id]
        );

        return result.rowCount > 0;
    }

}