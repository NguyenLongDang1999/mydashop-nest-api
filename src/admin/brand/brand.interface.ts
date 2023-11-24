// ** Types Imports
import { Pagination } from '../types/core.type'

export interface IBrandSearch extends Pagination {
    name?: string
    category_id?: number
    status?: number
    popular?: number
}
