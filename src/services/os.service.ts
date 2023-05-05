
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { Client } from '@opensearch-project/opensearch'
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws'

class OpensearchService {

  node: string
  indexName: string
  client: Client

  constructor() {
    this.node = String(process.env.ELASTICSEARCH_ENDPOINT)
    this.indexName = 'content'
    const client = new Client({
      ...AwsSigv4Signer({
        region: 'us-east-1',
        service: 'es', 
        getCredentials: () => {
          const credentialsProvider = defaultProvider();
          return credentialsProvider();
        },
      }),
      node: this.node,
    });
    this.client = client
  }

  async search(search: string) {
    try {
      const query = {
        query: {
          multi_match: {
            query: search,
            fields: ["title^2", "content", "link" ]
          },
        },
      };
      
      const response = await this.client.search({
        index: this.indexName,
        body: query,
      });  
      const results = response.body.hits.hits.map( (result: any) => { 
        return { 
          _score: result._score,
          date: result._source.date,
          link: result._source.link,
          title: result._source.title,
          type: result._source.type,
          excerpt: result._source.excerpt,
        }
      })
      return results
    } catch (err) {
      console.error(`[os] psearch failed: ${err}`)
      throw err
    }
  }

  async index(doc: any, id: string) {
    try {
      var response = await this.client.index({
        id: id,
        index: this.indexName,
        body: doc,
        refresh: true,
      });      
      return { "results": response }
    } catch (err) {
      console.error(`[os] psearch failed: ${err}`)
      throw err
    }
  }

  async delete() {
    try {
      var response = await this.client.indices.delete({
        index: this.indexName,
      });
      return { "results": response }
    } catch (err) {
      console.error(`[os] search index reset failed: ${err}`)
      throw err
    }
  }

}

export default OpensearchService
