import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateProductDTO, ProductDTO, UpdateProductDTO } from "../dto/product";
import z from "zod";
import { MultipartFile } from "@fastify/multipart";

interface IProductService {

    getProduct(id: number) : Promise<ProductDTO | null>

    getListProduct() : Promise<ProductDTO[]>

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
    app.get("/product", GetListProduct)
    app.get("/product/:product_id", GetProductById)
    app.post("/product", CreateProduct)
    app.patch("/product/:product_id", UpdateProduct)
    app.delete("/product/:product_id", DeleteProduct)

    return app
}

async function GetListProduct(request: FastifyRequest, reply: FastifyReply) {
    try {
        const products: ProductDTO[] = await productService.getListProduct()

        return reply.code(200).send({
            message: "products loaded",
            body: products
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

async function GetProductById(request: FastifyRequest, reply: FastifyReply) {
    try {
        const {product_id} = request.params as {product_id: number}

        const product = await productService.getProduct(product_id)
        if (!product) {
            return reply.code(404).send({
                message: "Product not found",
                body: null
            })
        }

        return reply.code(200).send({
            message: "product loaded",
            body: product
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

async function CreateProduct(request: FastifyRequest, reply: FastifyReply) {
    const file: MultipartFile | undefined = await request.file()

    if (!file) {
        return reply.code(500).send({
            message: "something went wrong",
            body: null
        })
    }

    const fileData = file.fields as Record<string, { value: string }>
    const payload = {
        sku: fileData.sku?.value,
        title: fileData.title?.value,
        price: Number(fileData.price?.value),
        description: fileData.description?.value,
        image: file
    }

    const val = z.object({
        title: z.string("Title should be string").min(1, "Title is required"),
        sku: z.string("SKU should be string").min(1, "Title is required"),
        price: z.number("Price should be number"),
        description: z.string("Description should be string").min(1, "Title is required"),
        image: z.custom<MultipartFile>((file) => {
            console.log(file)
            if (!file) return false;

            // Cek size
            if (file.file.bytesRead > 2 * 1024 * 1024) {
                return false;
            }

            // Cek mimetype
            if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
                return false;
            }

            return true;
        }, {
            message: "File must be JPG/PNG and smaller than 2MB"
        })
    }).safeParse(payload ?? {})

    const data: CreateProductDTO = {
        sku: payload.sku,
        title: payload.title,
        price: Number(payload.price),
        description: payload.description,
        file_image: file
    }

    if (!val.success) {
        return reply.code(400).send({
            message: "validation failed",
            body: val.error.flatten().fieldErrors
        })
    }

    try {
        const result = await productService.createProduct(data)
        if (!result) {
            throw new Error('something went wrong')
        }

        return reply.code(201).send({
            message: "product created",
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

    const file: MultipartFile | undefined = await request.file()

    if (!file) {
        return reply.code(500).send({
            message: "something went wrong",
            body: null
        })
    }

    const fileData = file.fields as Record<string, { value: string }>
    const payload = {
        sku: fileData.sku?.value,
        title: fileData.title?.value,
        price: Number(fileData.price?.value),
        description: fileData.description?.value,
        image: file
    }

    const val = z.object({
        title: z.string("Title should be string").min(1, "Title is required").optional(),
        sku: z.string("SKU should be string").min(1, "Title is required").optional(),
        price: z.number("Price should be number").optional(),
        description: z.string("Description should be string").min(1, "Title is required").optional(),
        image: z.custom<MultipartFile>((file) => {
            if (!file) return false;

            // Cek size
            if (file.file.bytesRead > 2 * 1024 * 1024) {
            return false;
            }

            // Cek mimetype
            if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
            return false;
            }

            return true;
        }, {
            message: "File must be JPG/PNG and smaller than 2MB"
        }).optional()
    }).safeParse(fileData ?? {})

    if (!val.success) {
        return reply.code(400).send({
            message: "validation failed",
            body: val.error.flatten().fieldErrors
        })
    }
    
    const data: UpdateProductDTO = {
        sku: payload.sku,
        title: payload.title,
        price: payload.price,
        description: payload.description,
        file_image: file
    }

    try {
        const result = await productService.updateProduct(product_id, data)
        if (!result) {
            throw new Error('something went wrong')
        }

        return reply.code(200).send({
            message: "product updated",
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

async function DeleteProduct(request: FastifyRequest, reply: FastifyReply) {
    const {product_id} = request.params as {product_id: number}

    const product = await productService.getProduct(product_id)
    if (!product) {
        return reply.code(404).send({
            message: "Product not found",
            body: null
        })
    }

    try {
        const result = await productService.deleteProduct(product_id)
        if (!result) {
            throw new Error('something went wrong')
        }

        return reply.code(200).send({
            message: "product deleted",
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