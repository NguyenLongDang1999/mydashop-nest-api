// ** Types Imports
import { Pagination } from '../types/core.type'

export interface IFlashSaleSearch extends Pagination {
    campaign_name?: string
    product_id?: number
}
