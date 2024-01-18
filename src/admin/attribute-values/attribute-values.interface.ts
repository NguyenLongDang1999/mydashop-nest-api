// ** Types Imports
import { Pagination } from '../types/core.type'

export interface IAttributeValuesSearch extends Pagination {
    value?: string
    attribute_id?: number
}
