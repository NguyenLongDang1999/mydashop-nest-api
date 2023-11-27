import { Controller } from '@nestjs/common'
import { FlashSaleService } from './flash-sale.service'

@Controller('flash-sale')
export class FlashSaleController {
    constructor(private readonly flashSaleService: FlashSaleService) {}
}
