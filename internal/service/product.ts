import { randomUUID } from "crypto"
import { CreateProductDTO, ProductDTO, toProductDTO, UpdateProductDTO } from "../dto/product"
import ProductModel from "../model/product"
import { Multipart } from "@fastify/multipart"
import path from "path"
import { promises } from "fs"
import UploadFile from "../../pkg/upload/upload"

interface IProductRepository {

    findOne(id: number) : Promise<ProductModel | null> 

    findOneBySKU(sku: string) : Promise<ProductModel | null> 

    findAll() : Promise<ProductModel[]> 

    create(data: CreateProductDTO) : Promise<ProductModel> 

    update(id: number, data: UpdateProductDTO) : Promise<ProductModel> 

    delete(id: number) : Promise<boolean>

}

export default class ProductService {

    private productRepository: IProductRepository

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository
    }

    async getProduct(id: number) : Promise<ProductDTO | null> {
        const product: ProductModel | null = await this.productRepository.findOne(id)
        
        return product ? toProductDTO(product) : null
    }

    async getProductBySKU(sku: string) : Promise<ProductDTO | null> {
        const product: ProductModel | null = await this.productRepository.findOneBySKU(sku)

        return product ? toProductDTO(product) : null
    }

    async getListProduct() : Promise<ProductDTO[]> {
        const products: ProductModel[] = await this.productRepository.findAll()

        return products.map(v => toProductDTO(v))
    }

    async createProduct(data: CreateProductDTO) : Promise<boolean> {
        data.title = data.title.toLowerCase()

        if (await this.productRepository.findOneBySKU(data.sku) != null) {
            throw new Error("SKU already exists")
        }

        if (data.file_image) {
            const image = await UploadFile(data.file_image)
            if (!image) {
                throw new Error('failed to upload file')
            }

            data.image = image
        }

        const product: ProductModel = await this.productRepository.create(data)

        return product != null
    }

    async updateProduct(id: number, data: UpdateProductDTO) : Promise<boolean> {
        data.title = data.title?.toLowerCase()

        if (data.sku) {
            if (await this.productRepository.findOneBySKU(data.sku) != null) {
                throw new Error("SKU already exists")
            }
        }

        if (data.file_image) {
            const image = await UploadFile(data.file_image)
            if (!image) {
                throw new Error('failed to upload file')
            }

            data.image = image
        }
        
        const product: ProductModel = await this.productRepository.update(id, data)

        return product != null
    }

    async deleteProduct(id: number) : Promise<boolean> {
        const result = await this.productRepository.delete(id)

        return result == true
    }

}
