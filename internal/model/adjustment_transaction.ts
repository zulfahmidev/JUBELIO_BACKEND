export default class AdjustmentTransactionModel {
    public id: number
    public sku: string
    public qty: number
    public amount: number
    public created_at: Date
    public updatedd_at: Date

    constructor({ id, sku, qty, amount, created_at, updatedd_at }: {
        id: number,
        sku: string,
        qty: number,
        amount: number,
        created_at: Date,
        updatedd_at: Date,
    }) {
        this.id = id
        this.sku = sku
        this.qty = qty
        this.amount = amount
        this.created_at = created_at
        this.updatedd_at = updatedd_at
    }
}