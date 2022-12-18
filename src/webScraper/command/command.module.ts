import { Module } from '@nestjs/common';
import { Command, CommandFactory, CommandRunner, Option } from 'nest-commander';
import { WebscraperService } from '../services/webscraper.service';
// import { mainScraper } from './mainScraper';

  @Command({ name: 'basic', description: 'A parameter parse' })
  export class WebscraperCommand extends CommandRunner {

    constructor(private readonly webscraperService: WebscraperService) {
      super();
  };
    
    async run() : Promise<void> {
      console.log("starting in command mod one");
        this.callMainScrapper();
    }

    @Option({
      flags: '-ms',
      description: 'Call the main scraper',
    })

    callMainScrapper(){
      console.log("starting in command mod")
     this.webscraperService.mainScraper();
    }

  };

