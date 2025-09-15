import { FastifyInstance } from "fastify";
import AdjustmentTransactionRepository from "../internal/repository/adjustment_transaction";
import AdjustmentTransactionService from "../internal/service/adjustment_transaction";
import AdjustmentTransactionHandler from "../internal/handler/adjustment_transaction";
import ProductHandler from "../internal/handler/product";
import ProductRepository from "../internal/repository/product";
import ProductService from "../internal/service/product";

export default function InitDependencies(app: FastifyInstance) : FastifyInstance {

    // repositories
    const adjustmentTransactionRepository = new AdjustmentTransactionRepository()
    const productRepository = new ProductRepository()

    // Services
    const adjustmentTransactionService = new AdjustmentTransactionService(adjustmentTransactionRepository)
    const productService = new ProductService(productRepository)

    // Handlers
    app = AdjustmentTransactionHandler(app, adjustmentTransactionService)
    app = ProductHandler(app, productService)

    return app
}