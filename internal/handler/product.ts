import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateProductDTO, ProductDTO, UpdateProductDTO } from "../dto/product";
import z from "zod";

export interface IProductService {

    getProduct(id: number) : Promise<ProductDTO | null>

    getListProduct() : Promise<ProductDTO[] | null>

    createProduct(data: CreateProductDTO) : Promise<boolean>

    updateProduct(id: number, data: UpdateProductDTO) : Promise<boolean>

    deleteProduct(id: number) : Promise<boolean>
}

let productService: IProductService;

export default function ProductHandler(
        app: FastifyInstance, 
        ps: IProductService
    ) : FastifyInstance {

    productService = ps
    app.post("/product", CreateProduct)
    app.patch("/product/:product_id", UpdateProduct)

    return app
}

async function CreateProduct(request: FastifyRequest, reply: FastifyReply) {
    const val = z.object({
        title: z.string("Title should be string").min(1, "Title is required"),
        sku: z.string("SKU should be string").min(1, "Title is required"),
        price: z.number("Price should be number"),
        description: z.string("Description should be string").min(1, "Title is required")
    }).safeParse(request.body ?? {})

    if (!val.success) {
        return reply.code(400).send({
            message: "validation failed",
            body: val.error.flatten().fieldErrors
        })
    }

    const payload = request.body as CreateProductDTO
    const data: CreateProductDTO = {
        sku: payload.sku,
        title: payload.title,
        price: payload.price,
        description: payload.description,
    }

    try {
        const result = await productService.createProduct(data)
        if (!result) {
            throw new Error('something went wrong')
        }

        return reply.code(201).send({
            message: "created product",
            body: null
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(error)
        return reply.code(500).send({
            message: message,
            body: null
        })
    }
}

async function UpdateProduct(request: FastifyRequest, reply: FastifyReply) {
    const {product_id} = request.params as {product_id: number}

    const product = await productService.getProduct(product_id)
    if (!product) {
        return reply.code(404).send({
            message: "Product not found",
            body: null
        })
    }

    const val = z.object({
        title: z.string("Title should be string").min(1, "Title is required").optional(),
        sku: z.string("SKU should be string").min(1, "Title is required").optional(),
        price: z.number("Price should be number").optional(),
        description: z.string("Description should be string").min(1, "Title is required").optional()
    }).safeParse(request.body ?? {})

    if (!val.success) {
        return reply.code(400).send({
            message: "validation failed",
            body: val.error.flatten().fieldErrors
        })
    }

    const payload = request.body as UpdateProductDTO
    const data: UpdateProductDTO = {
        sku: payload.sku,
        title: payload.title,
        price: payload.price,
        description: payload.description,
    }

    try {
        const result = await productService.updateProduct(product_id, data)
        if (!result) {
            throw new Error('something went wrong')
        }

        return reply.code(201).send({
            message: "updated product",
            body: null
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(error)
        return reply.code(500).send({
            message: message,
            body: null
        })
    }
}