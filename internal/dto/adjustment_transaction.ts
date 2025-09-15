export interface AdjustmentTransactionDTO {
    id: number,
    sku: string,
    qty: number,
    amount: number,
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