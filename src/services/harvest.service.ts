import * as cheerio from 'cheerio';
import axios from 'axios';

class HarvestService {

  constructor() {
  }

  async get(url: string){

    try {
      console.log(`[harvest service] get ${url}`)
      
      const {data} = await axios.get(url)
      const $ = cheerio.load(data);
      let body = $("body")
      body.find('iframe').remove()
      body.find('script').remove()

      let bodyText = body.text()
      bodyText = bodyText.replace(/\s\s+/g, ' ');
      bodyText = bodyText.replace(/<iframe.*?<\/iframe\s*>/gi, ' ');

      let title = $("title").text()
      title = title.replace(/\s\s+/g, ' ');

      const description = $('meta[name="description"]').attr('content')

      const doc = {
        type: 'website', content: bodyText, title, excerpt: description, link: url
      }

      return doc
    } catch (err) {
      console.error(`[os] psearch failed: ${err}`)
      throw err
    }

  }

  
}

export default HarvestService
