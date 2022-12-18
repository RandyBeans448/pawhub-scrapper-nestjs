import { Body, Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

import { PropertyInterface } from '../models/webscraper.interface';

const pageUrls : Array<string> = [];

const baseUrl : string = `https://www.dogfriendly.co.uk`;

const anchors : Array<string> = [];

const properties : Array<PropertyInterface> = [];

// Category URL for root scrape
const listOfUrls : Array<string> = [

     //search for restaurants
    `${baseUrl}/restaurants-and-cafes?category=restaurants-and-cafes&location`,

    //search for pubs
    `${baseUrl}/pubs`,

    //seach for camping and carvanning 
    `${baseUrl}/camping-and-caravanning`,

    //seach for cottages and self catering
    `${baseUrl}/cottages-and-self-catering`,

];

@Injectable()
export class WebscraperService {
  
getPages = async (browser: puppeteer.Browser, page: puppeteer.Page, urlIndex: number) : Promise<void> => {

    console.log("get pages");
  
    const pageFilter : string = '#filters=|page={{page}}';
    
    let pages : number = 0;
  
    await page.goto(listOfUrls[urlIndex], { waitUntil: 'networkidle2' });
  
    try {
  
        const lastPage : any = await page.evaluate(() => { 
          
          return Array.from(document.querySelectorAll(".paging-select")).map((x) => x.innerHTML);
    
          });
  
          pages = Number(lastPage[8]);
  
          for (let index : number = 1; index <= pages; index++) {
  
            const pageIndex : string = String(index);
  
            pageUrls.push(`${listOfUrls[urlIndex]}${pageFilter.replace('{{page}}', pageIndex)}`);
  
          };
  
    } catch (error : any) {
  
        console.error("No accommodations could be found");
        
        console.log(error);
        
        await browser.close();
    }
  
  }

  getAnchors = async (browser: puppeteer.Browser) : Promise<void> => {

    console.log("get anchors");
  
    // for (const listing of pageUrls) {
  
    for (let i = 0; i < 10; i ++) {
  
      const newPage : puppeteer.Page = await browser.newPage();
  
      await newPage.goto(pageUrls[i], { waitUntil: 'networkidle2' });
  
      const data : any = await newPage.evaluate(() => document.body.innerHTML);
    
      const $ : any = cheerio.load(data);
    
      const itemUrls : any = $('#search_listings').find('h4.g-font-weight-800.g-mb-0 a');
    
      itemUrls.toArray().forEach(anchor => anchors.push(`${baseUrl}${$(anchor).attr('href')}`));
      itemUrls.toArray().forEach(anchor => console.log(`${baseUrl}${$(anchor).attr('href')}`));
  
    }
  
    await browser.close();
  
  };

  getDataFromPage  = async () : Promise<void> => {

    for (const anchorLink of anchors) {
  
      const response : any = await fetch(anchorLink);
  
      const body : any = await response.text();
  
      let type : string = '';
  
      if (anchorLink.includes('restaurants-and-cafes')) {
            type = 'Restaurant';
      }
  
      if (anchorLink.includes('pub')) {
            type = 'Pub';
      }
  
      if (anchorLink.includes('camping-and-caravanning')) {
            type = 'Camping';
      }
  
      if (anchorLink.includes('cottages-and-self-catering')) {
            type = 'Cottage';
      }
  
      const $ : any = cheerio.load(body);
  
      const addressData : Array<string> = $('.g-bg-secondary.g-py-20.g-px-30.g-rounded-bottom-5.g-brd-none p').html().split('<br>');
      
      const dataLength : number = addressData.length;
  
      let telephone : string = cheerio.load(addressData[dataLength - 2])('a').attr('href');
  
      let telephoneNumber : string = '';
  
      const websiteLink : string = cheerio.load(addressData[dataLength - 1])('a').attr('href');
  
  
        if (telephone === undefined) {
  
            telephoneNumber = null;
  
        } else {
  
            telephoneNumber = telephone.replace('tel:', '');
  
        };
  
  
      let canLeaveDogsUnattended : string = $('span:contains("Can Leave Dog Unattended")').parent().next().html(); 
  
      let dogsUnattended : boolean = false;
  
  
        if (canLeaveDogsUnattended === 'Yes') {
  
            dogsUnattended = true;
        }
        
  
      let maxNumberOfDogs : number = $('span:contains("No. Of Dogs Allowed")').parent().next().html();
  
      let numberOfDogs : number = Number(maxNumberOfDogs);
  
      
        if (numberOfDogs === 0) {
  
             numberOfDogs = 1;
  
        }
  
      let extraCharge : string = $('span:contains("Charge For Dogs")').parent().next().html();
  
      let charge : boolean = false;
  
  
        if (extraCharge === 'Yes') {
  
            charge = true;
  
        }
  
      addressData.pop();
      addressData.pop();
  
      const prop : PropertyInterface = {
        address: addressData.toString(),
        telephone: telephoneNumber,
        website: websiteLink,
        canLeaveDogsUnattended: dogsUnattended,
        maxDogs: numberOfDogs,
        extraCharge: charge,
        type: type
      };
  
    console.log(prop, "prop")
  
    properties.push(prop); 
    
    };
  
  };

  mainScraper = async () : Promise<void> => {

    console.log("starting main scraper")

    const browser: puppeteer.Browser = await puppeteer.launch({  args: ['--no-sandbox',  '--disable-dev-shm-usage'] });
    
    const page: puppeteer.Page = await browser.newPage();
  
      for (let urlIndex : number = 0; urlIndex < listOfUrls.length; urlIndex ++) {
  
        await this.getPages(browser, page, urlIndex);
  
      }
  
        await this.getAnchors(browser).then(() => { this.getDataFromPage() })
     
    };


};
