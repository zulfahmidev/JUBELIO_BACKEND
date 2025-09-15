import { FastifyInstance } from "fastify";

export interface IAdjustmentTransactionService {

}

export default function AdjustmentTransactionHandler(
        app: FastifyInstance, 
        adjustmentTransactionService: IAdjustmentTransactionService
    ) : FastifyInstance {


    return app
}