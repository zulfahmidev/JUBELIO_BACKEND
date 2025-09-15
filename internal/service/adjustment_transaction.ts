import { AdjustmentTransactionDTO, CreateAdjustmentTransactionDTO, toAdjustmentTransactionDTO, UpdateAdjustmentTransactionDTO } from "../dto/adjustment_transaction"
import AdjustmentTransactionModel from "../model/adjustment_transaction"

interface IAdjustmentTransactionRepository {

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
    
    async getAdjustmentTransaction(id: number) : Promise<AdjustmentTransactionDTO | null> {
        const adjustmentTransaction: AdjustmentTransactionModel | null = await this.adjustmentTransactionRepository.findOne(id)

        return adjustmentTransaction ? toAdjustmentTransactionDTO(adjustmentTransaction) : null
    }

    async getListAdjustmentTransaction() : Promise<AdjustmentTransactionDTO[]> {
        const adjustmentTransactions: AdjustmentTransactionModel[] = await this.adjustmentTransactionRepository.findAll()

        return adjustmentTransactions.map(v => toAdjustmentTransactionDTO(v))
    }

    async createAdjustmentTransaction(data: CreateAdjustmentTransactionDTO) : Promise<boolean> {
        const adjustmentTransaction: AdjustmentTransactionModel = await this.adjustmentTransactionRepository.create(data)

        return adjustmentTransaction != null
    }

    async updateAdjustmentTransaction(id: number, data: UpdateAdjustmentTransactionDTO) : Promise<boolean> {
        const adjustmentTransaction: AdjustmentTransactionModel = await this.adjustmentTransactionRepository.update(id, data)

        return adjustmentTransaction != null
    }

    async deleteAdjustmentTransaction(id: number) : Promise<boolean> {
        const result = await this.adjustmentTransactionRepository.delete(id)

        return result == true
    }

}