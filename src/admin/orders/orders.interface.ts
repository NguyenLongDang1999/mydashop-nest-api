// ** Types Imports
import { Pagination } from '../types/core.type'

export interface IOrdersSearch extends Pagination {
    code?: string
    status?: number
    viewed?: number
}
