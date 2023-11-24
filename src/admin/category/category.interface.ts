// ** Types Imports
import { Pagination } from '../types/core.type'

export interface ICategorySearch extends Pagination {
    name?: string
    parent_id?: number
    status?: number
    popular?: number
}
