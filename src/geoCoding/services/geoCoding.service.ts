import { Injectable, LoggerService, Logger } from '@nestjs/common';
import { HttpService } from 'nestjs-http-promise'


const apiKey : string = 'apikey';

const searchQuery : string = 'Time for Tea 7 Bridge Street Kidwelly Carmarthenshire SA17 4UU'

const url : string = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${apiKey}`

@Injectable()
export class GeoCodingService {

    constructor(private readonly httpService: HttpService) {}

          public getGeoCoding(): Promise<object> {
            console.log("geo coding");
            return this.httpService.get(url).then(response => { console.log(response.data.features[0].geometry); return response.data.features }) 
          }

 
};
