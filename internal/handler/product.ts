import { FastifyInstance } from "fastify";

export interface IProductService {

}

export default function ProductHandler(
        app: FastifyInstance, 
        productService: IProductService
    ) : FastifyInstance {

        

    return app
}