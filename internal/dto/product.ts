import ProductModel from "../model/product"

export interface ProductDTO {
    id: number,
    title: string,
    sku: string,
    price: number,
    description: string,
    created_at: Date
}

export function toProductDTO(data: ProductModel) : ProductDTO {
    return {
        id: data.id,
        title: data.title,
        sku: data.sku,
        price: data.price,
        description: data.description,
        created_at: data.created_at
    }
}

export interface CreateProductDTO {
    title: string,
    sku: string,
    price: number,
    description: string
}

export interface UpdateProductDTO {
    title: string,
    sku: string,
    price: number,
    description: string
}