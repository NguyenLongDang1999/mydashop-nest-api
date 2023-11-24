// ** Types Imports
import { Pagination } from '../types/core.type'

export interface IAttributeSearch extends Pagination {
    name?: string
    category_id?: number
    status?: number
}
