import { Controller, Get} from '@nestjs/common';
import { GeoCodingService } from '../services/geoCoding.service';




@Controller()
export class GeoCodingController {
    constructor(
        private geoCodingService: GeoCodingService,
        ) {
    }

    @Get()
    getCoordinates() {
        return this.geoCodingService.getGeoCoding()
    }

}