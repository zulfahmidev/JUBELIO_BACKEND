import { getDB } from "../../pkg/database/database";
import { CreateAdjustmentTransactionDTO, UpdateAdjustmentTransactionDTO } from "../dto/adjustment_transaction";
import AdjustmentTransactionModel from "../model/adjustment_transaction";

export default class AdjustmentTransactionRepository {

    async findOne(id: number) : Promise<AdjustmentTransactionModel | null> {
        const db = getDB()
        const row = await db.oneOrNone(`
            SELECT * FROM adjustment_transactions WHERE id = $1
        `, id)

        return row ? new AdjustmentTransactionModel(row) : null
    }

    async findAll() : Promise<AdjustmentTransactionModel[]> {
        const db = getDB()
        const rows: AdjustmentTransactionModel[] = await db.any(`
            SELECT * FROM adjustment_transactions
        `)

        return rows.map(row => new AdjustmentTransactionModel(row))
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