export default class ProductModel {
    public id: number
    public title: string
    public sku: string
    public price: number
    public description: string
    public createdAt: Date
    public updateddAt: Date

    constructor({ id, title, sku, price, description, createdAt, updateddAt }: {
        id: number,
        title: string,
        sku: string,
        price: number,
        description: string,
        createdAt: Date,
        updateddAt: Date,
    }) {
        this.id = id
        this.title = title
        this.sku = sku
        this.price = price
        this.description = description
        this.createdAt = createdAt
        this.updateddAt = updateddAt
    }
}