export interface ProductDTO {
    id: number,
    title: string,
    sku: string,
    price: number,
    description: string
    created_at: Date
}

export interface CreateProductDTO {
    title: string,
    sku: string,
    price: number,
    description: string
}

export interface UpdateProductDTO {
    title: string,
    price: number,
    description: string
}