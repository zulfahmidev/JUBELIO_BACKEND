import { CreateProductDTO } from "../dto/product"

export default class DummyOutbound {

    async getProducts() : Promise<CreateProductDTO[]> {
        let products: CreateProductDTO[] = []
        const response = await fetch("https://dummyjson.com/products")
        if (response.ok) {
            const result = await response.json()
            products = result.products.map((v: any) => {
                return {
                    image: v?.images[0],
                    title: v?.title,
                    description: v?.description,
                    price: v?.price,
                    sku: v?.sku,
                } as CreateProductDTO
            })
        }

        return products
    }
}
