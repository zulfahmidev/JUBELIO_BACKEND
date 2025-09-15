import AdjustmentTransactionModel from "../model/adjustment_transaction";

export interface AdjustmentTransactionDTO {
    id: number,
    sku: string,
    qty: number,
    amount: number,
    created_at: Date
}

export interface GetListAdjustmentTransactionDTO {
    page?: number;
    limit?: number;
    search?: string;
    sort?: "ASC" | "DESC";
    order?: string;
}

export function toAdjustmentTransactionDTO(data: AdjustmentTransactionModel) : AdjustmentTransactionDTO {
    return {
        id: data.id,
        sku: data.sku,
        qty: data.qty,
        amount: data.amount,
        created_at: data.created_at
    }
}

export interface CreateAdjustmentTransactionDTO {
    sku: string,
    qty: number,
    amount: number,
}

export interface UpdateAdjustmentTransactionDTO {
    sku: string,
    qty: number,
    amount: number,
}