// ** Types Imports
import { Pagination } from '../types/core.type'

export interface IProductSearch extends Pagination {
    sku?: string
    name?: string
    category_id?: number
    brand_id?: number
    status?: number
    popular?: number
}
