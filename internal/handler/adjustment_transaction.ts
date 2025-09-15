import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AdjustmentTransactionDTO, CreateAdjustmentTransactionDTO, UpdateAdjustmentTransactionDTO } from "../dto/adjustment_transaction";
import { ProductDTO } from "../dto/product";
import z from "zod";

interface IAdjustmentTransactionService {
    getAdjustmentTransaction(id: number) : Promise<AdjustmentTransactionDTO | null>

    getListAdjustmentTransaction() : Promise<AdjustmentTransactionDTO[]>

    createAdjustmentTransaction(data: CreateAdjustmentTransactionDTO) : Promise<boolean>

    updateAdjustmentTransaction(id: number, data: UpdateAdjustmentTransactionDTO) : Promise<boolean>

    deleteAdjustmentTransaction(id: number) : Promise<boolean>
}

interface IProductService {
    getProductBySKU(sku: string) : Promise<ProductDTO | null>
}

let productService: IProductService;
let adjustmentTransactionService: IAdjustmentTransactionService;

export default function AdjustmentTransactionHandler(
    app: FastifyInstance, 
    ats: IAdjustmentTransactionService,
    ps: IProductService,
) : FastifyInstance {

    productService = ps
    adjustmentTransactionService = ats
    app.get("/adjustment-transaction", GetListAdjustmentTransaction)
    app.get("/adjustment-transaction/:adjustment_transaction_id", GetAdjustmentTransaction)
    app.post("/adjustment-transaction", CreateAdjustmentTransaction)
    app.patch("/adjustment-transaction/:adjustment_transaction_id", UpdateAdjustmentTransaction)
    app.delete("/adjustment-transaction/:adjustment_transaction_id", DeleteAdjustmentTransaction)

    return app
}

async function GetListAdjustmentTransaction(request: FastifyRequest, reply: FastifyReply) {
    try {
        const adjustmentTransactions: AdjustmentTransactionDTO[] = await adjustmentTransactionService.getListAdjustmentTransaction()

        return reply.code(200).send({
            message: "adjustment transactions loaded",
            body: adjustmentTransactions
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

async function GetAdjustmentTransaction(request: FastifyRequest, reply: FastifyReply) {
    try {
        const {adjustment_transaction_id} = request.params as {adjustment_transaction_id: number}

        const adjustmentTransaction = await adjustmentTransactionService.getAdjustmentTransaction(adjustment_transaction_id)
        if (!adjustmentTransaction) {
            return reply.code(404).send({
                message: "adjustment transactions not found",
                body: null
            })
        }

        return reply.code(200).send({
            message: "adjustment transactions loaded",
            body: adjustmentTransaction
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

async function CreateAdjustmentTransaction(request: FastifyRequest, reply: FastifyReply) {
    const val = z.object({
        sku: z.string("SKU should be string").min(1, "Title is required"),
        qty: z.number("Price should be number"),
        amount: z.number("Price should be number"),
    }).safeParse(request.body ?? {})

    if (!val.success) {
        return reply.code(400).send({
            message: "validation failed",
            body: val.error.flatten().fieldErrors
        })
    }

    const payload = request.body as CreateAdjustmentTransactionDTO
    const data: CreateAdjustmentTransactionDTO = {
        sku: payload.sku,
        qty: payload.qty,
        amount: payload.amount,
    }

    if (await productService.getProductBySKU(data.sku) == null) {
        return reply.code(404).send({
            message: "Product with this SKU not found",
            body: null
        })
    }

    try {
        const result = await adjustmentTransactionService.createAdjustmentTransaction(data)
        if (!result) {
            throw new Error('something went wrong')
        }

        return reply.code(201).send({
            message: "adjustment transactions created",
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

async function UpdateAdjustmentTransaction(request: FastifyRequest, reply: FastifyReply) {
    const {adjustment_transaction_id} = request.params as {adjustment_transaction_id: number}

    const adjustmentTransaction = await adjustmentTransactionService.getAdjustmentTransaction(adjustment_transaction_id)
    if (!adjustmentTransaction) {
        return reply.code(404).send({
            message: "adjustment transactions not found",
            body: null
        })
    }

    const val = z.object({
        sku: z.string("SKU should be string").min(1, "Title is required").optional(),
        qty: z.number("Price should be number").optional(),
        amount: z.number("Price should be number").optional(),
    }).safeParse(request.body ?? {})

    if (!val.success) {
        return reply.code(400).send({
            message: "validation failed",
            body: val.error.flatten().fieldErrors
        })
    }

    const payload = request.body as UpdateAdjustmentTransactionDTO
    const data: UpdateAdjustmentTransactionDTO = {
        sku: payload.sku,
        qty: payload.qty,
        amount: payload.amount,
    }

    if (data.sku) {
        if (await productService.getProductBySKU(data.sku) == null) {
            return reply.code(404).send({
                message: "Product with this SKU not found",
                body: null
            })
        }
    }

    try {
        const result = await adjustmentTransactionService.updateAdjustmentTransaction(adjustment_transaction_id, data)
        if (!result) {
            throw new Error('something went wrong')
        }

        return reply.code(201).send({
            message: "adjustment transactions updated",
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

async function DeleteAdjustmentTransaction(request: FastifyRequest, reply: FastifyReply) {
    const {adjustment_transaction_id} = request.params as {adjustment_transaction_id: number}

    const adjustmentTransaction = await adjustmentTransactionService.getAdjustmentTransaction(adjustment_transaction_id)
    if (!adjustmentTransaction) {
        return reply.code(404).send({
            message: "adjustment transactions not found",
            body: null
        })
    }

    try {
        const result = await adjustmentTransactionService.deleteAdjustmentTransaction(adjustment_transaction_id)
        if (!result) {
            throw new Error('something went wrong')
        }

        return reply.code(201).send({
            message: "adjustment transactions deleted",
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
