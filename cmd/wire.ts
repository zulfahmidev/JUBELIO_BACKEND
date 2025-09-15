import { FastifyInstance } from "fastify";
import AdjustmentTransactionRepository from "../internal/repository/adjustment_transaction";
import AdjustmentTransactionService from "../internal/service/adjustment_transaction";
import AdjustmentTransactionHandler from "../internal/handler/adjustment_transaction";
import ProductHandler from "../internal/handler/product";
import ProductRepository from "../internal/repository/product";
import ProductService from "../internal/service/product";
import DummyOutbound from "../internal/outbound/dummy";

export default function InitDependencies(app: FastifyInstance) : FastifyInstance {

    // Outbounds
    const dummyOutbound = new DummyOutbound()

    // repositories
    const adjustmentTransactionRepository = new AdjustmentTransactionRepository()
    const productRepository = new ProductRepository()

    // Services
    const adjustmentTransactionService = new AdjustmentTransactionService(adjustmentTransactionRepository)
    const productService = new ProductService(productRepository, dummyOutbound)

    // Handlers
    app = ProductHandler(app, productService)
    app = AdjustmentTransactionHandler(app, adjustmentTransactionService, productService)

    return app
}