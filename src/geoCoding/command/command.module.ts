import { Command, CommandFactory, CommandRunner, Option } from 'nest-commander';
import { GeoCodingController } from '../controllers/geoCoding.controller';
import { GeoCodingService } from '../services/geoCoding.service';

  @Command({ name: 'basic', description: 'A parameter parse' })
  export class GeoCommand extends CommandRunner {

    constructor(private readonly geoCodingService: GeoCodingService) {
        super();
    };
    
    async run() : Promise<void> {
        console.log("starting in command mod one");
        this.callGeoLocationSearch();
    };

    @Option({
      flags: '-geo',
      description: 'Call the geo locater',
    })
    callGeoLocationSearch(){
      console.log("starting in command mod")
      this.geoCodingService.getGeoCoding();
    };

  };

  // npx ts-node ./src/geoCoding/command/command.module.ts basic -geo