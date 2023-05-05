import { OpensearchService, GraphqlService, HarvestService } from "../services"

class BuildService {

  os: OpensearchService
  graphql: GraphqlService
  baseUrl: string
  urls: string[]

  constructor() {
    this.os = new OpensearchService()
    this.graphql = new GraphqlService()
    this.baseUrl = String(process.env.BASE_URL)
    this.urls = String(process.env.PAGES).split(",").map(s=>s.trim())
  }

  async harvest(){
    const harvest = new HarvestService()

    console.log('%cbuild.service.ts line:20 this.urls', 'color: #007acc;', this.urls);

    const results = []
    for(let i=0; i<this.urls.length; i++){
      const url = this.urls[i]
      const doc = await harvest.get(url)
      const result = await this.os.index(doc, `site_${url.replace(/[^a-z0-9]/gi,'')}`) 
      results.push({
        statusCode: result.results.statusCode, 
        id: result.results.body._id,
        version: result.results.body._version,
        result: result.results.body.result,
      })
    }
    return results
  }

  async year(year: string) {
    try {
      const results = await this.graphql.getPostsByYear(year)
      const out = this.batch(results.posts.nodes, 'post')
      return out

    } catch (err) {
      console.error(`[build] build year failed: ${err}`)
      throw err
    }
  }

  async pages() {
    try {
      console.log(`[build service] get pages`)
      const results = await this.graphql.getPages()
      const out = this.batch(results.pages.nodes, 'page')
      return out
    } catch (err) {
      console.error(`[os] psearch failed: ${err}`)
      throw err
    }
  }

  async addPost(id: any) {
    try {
      console.log(`[build service] get ${id}`)
      const results = await this.graphql.getPostById(id)
      const out = this.batch(results.posts.nodes, 'post')
      return out
    } catch (err) {
      console.error(`[os] psearch failed: ${err}`)
      throw err
    }
  }

  async addPage(id: any) {
    try {
      console.log(`[build service] get ${id}`)
      const results = await this.graphql.getPageById(id)
      const out = this.batch(results.pages.nodes, 'page')
      return out
    } catch (err) {
      console.error(`[os] psearch failed: ${err}`)
      throw err
    }
  }

  private async batch(docs: any, type: string){
    try {
      const promises = docs.map( (doc:any) => {
        doc.link = `${this.baseUrl}${doc.uri}`
        doc.type = type
        return this.os.index(doc, `${type}_${doc.postId}`) 
      })
      const resultArray = await Promise.all(promises)
      const out = resultArray.map( result => (
        {
          statusCode: result.results.statusCode, 
          id: result.results.body._id,
          version: result.results.body._version,
          result: result.results.body.result,
      }))
      
      return out
    } catch (err) {
      console.error(`[os] batch failed: ${err}`)
      throw err
    }
  }    
  
}

export default BuildService
