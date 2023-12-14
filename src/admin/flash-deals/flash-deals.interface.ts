// ** Types Imports
import { Pagination } from '../types/core.type'

export interface IFlashDealsSearch extends Pagination {
    campaign_name?: string
    product_id?: number
}
