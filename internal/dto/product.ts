import { MultipartFile } from "@fastify/multipart"
import ProductModel from "../model/product"

export interface ProductDTO {
    id: number,
    title: string,
    image: string,
    sku: string,
    price: number,
    description: string,
    created_at: Date
}

export function toProductDTO(data: ProductModel) : ProductDTO {
    return {
        id: data.id,
        title: data.title,
        image: data.image,
        sku: data.sku,
        price: data.price,
        description: data.description,
        created_at: data.created_at
    }
}

export interface GetListProductDTO {
    page?: number;
    limit?: number;
    search?: string;
    sort?: "ASC" | "DESC";
    order?: string;
}

export interface CreateProductDTO {
    title: string,
    sku: string,
    price: number,
    description: string,
    image?: string,
    file_image: MultipartFile | undefined
}

export interface UpdateProductDTO {
    title: string,
    sku: string,
    price: number,
    description: string,
    image?: string,
    file_image: MultipartFile | undefined
}