import { CreateAdjustmentTransactionDTO, UpdateAdjustmentTransactionDTO } from "../dto/adjustment_transaction"
import AdjustmentTransactionModel from "../model/adjustment_transaction"

export interface IAdjustmentTransactionRepository {

    findOne(id: number) : Promise<AdjustmentTransactionModel | null> 

    findAll() : Promise<AdjustmentTransactionModel[]> 

    create(data: CreateAdjustmentTransactionDTO) : Promise<AdjustmentTransactionModel> 

    update(id: number, data: UpdateAdjustmentTransactionDTO) : Promise<AdjustmentTransactionModel> 

    delete(id: number) : Promise<boolean>

}

export default class AdjustmentTransactionService {

    private adjustmentTransactionRepository: IAdjustmentTransactionRepository

    constructor(adjustmentTransactionRepository: IAdjustmentTransactionRepository) {
        this.adjustmentTransactionRepository = adjustmentTransactionRepository
    }

    

}