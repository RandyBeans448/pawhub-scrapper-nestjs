import { Global, Module } from '@nestjs/common';
import { WebscraperService } from './services/webscraper.service';
import { WebscraperCommand } from './command/command.module'
import { CommandFactory} from 'nest-commander';


  @Global()
  @Module({
    providers: [WebscraperService, WebscraperCommand],
    exports: [WebscraperService]
    })
export class WebscraperModule {}

async function bootstrap() {
  console.log("bootstrap")
  await CommandFactory.run(WebscraperModule);
};

bootstrap();


// npx ts-node ./src/WebScraper/webscraper.module.ts basic -ms



