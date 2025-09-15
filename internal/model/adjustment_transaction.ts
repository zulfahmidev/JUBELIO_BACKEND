export default class AdjustmentTransactionModel {
    public id: number
    public sku: string
    public qty: number
    public amount: number
    public createdAt: Date
    public updateddAt: Date

    constructor({ id, sku, qty, amount, createdAt, updateddAt }: {
        id: number,
        sku: string,
        qty: number,
        amount: number,
        createdAt: Date,
        updateddAt: Date,
    }) {
        this.id = id
        this.sku = sku
        this.qty = qty
        this.amount = amount
        this.createdAt = createdAt
        this.updateddAt = updateddAt
    }
}