export default class ProductModel {
    public id: number
    public title: string
    public image: string
    public sku: string
    public price: number
    public description: string
    public created_at: Date
    public updatedd_at: Date

    constructor({ id, title, image, sku, price, description, created_at, updatedd_at }: {
        id: number,
        title: string,
        image: string,
        sku: string,
        price: number,
        description: string,
        created_at: Date,
        updatedd_at: Date,
    }) {
        this.id = id
        this.title = title
        this.image = image
        this.sku = sku
        this.price = price
        this.description = description
        this.created_at = created_at
        this.updatedd_at = updatedd_at
    }
}