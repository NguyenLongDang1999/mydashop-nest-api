// ** Types Imports
import { Pagination } from '../types/core.type'

export interface IProductSearch extends Pagination {
    sort?: number
    attribute?: number[]
    brand?: number[]
}
