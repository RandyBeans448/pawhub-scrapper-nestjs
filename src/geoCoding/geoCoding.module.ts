import { HttpModule } from 'nestjs-http-promise'
import { Global, Module } from '@nestjs/common';
import { GeoCodingService } from './services/geoCoding.service';
import { GeoCodingController } from './controllers/geoCoding.controller';
import { GeoCommand } from './command/command.module'
import { CommandFactory} from 'nest-commander';


@Global()
  @Module({
    providers: [GeoCodingService, GeoCommand],
    imports: [HttpModule],
    controllers: [GeoCodingController],
    exports: [GeoCodingService]
    })
export class GeoCodingModule {}

async function bootstrap() {
  console.log("bootstrap")
  await CommandFactory.run(GeoCodingModule);
};

bootstrap();

// npx ts-node ./src/geoCoding/geoCoding.module.ts basic -geo
