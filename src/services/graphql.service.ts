import { GraphQLClient, gql } from 'graphql-request'

class GraphqlService {

  node: string
  client: GraphQLClient

  constructor() {
    this.node = String(process.env.GRAPHQL_ENDPOINT)
    const graphQLClient = new GraphQLClient(this.node)
    this.client = graphQLClient
  }

  async getPostsByYear(year: string) {
    try {
      const query = gql`
      query Posts {
        posts(
          first: 10000, 
          where: {
            orderby: {field: DATE, order: DESC}, 
            dateQuery: {
              after: {day: 1, month: 1, year: ${year}},
              before: {day: 31, month: 12, year: ${year}}
            }
          }
        ) {
          nodes {
              postId
              date
              uri
              title
              content
              excerpt
          }
        }
      }
      `
      const data: any = await this.client.request(query)
      return data
    } catch (err) {
      console.error(`[graphql] search failed: ${err}`)
      throw err
    }
  }


  async getPages() {
    try {
      const query = gql`
      query Pages {
        pages {
          nodes {
              postId: pageId
              date
              uri
              title
              content
          }
        }
      }
      `
      const data: any = await this.client.request(query)
      return data
    } catch (err) {
      console.error(`[graphql] search failed: ${err}`)
      throw err
    }
  }  

  async getPostById(id: string) {
    try {
      const query = gql`
      query Posts {
        posts(
          where: {id: ${id}}
        ) {
          nodes {
              postId
              date
              uri
              title
              content
              excerpt
          }
        }
      }
      `
      const data: any = await this.client.request(query)
      return data
    } catch (err) {
      console.error(`[graphql] search failed: ${err}`)
      throw err
    }
  }  

  async getPageById(id: string) {
    try {
      const query = gql`
      query Page {
        pages(
          where: {id: ${id}}
        ) {
          nodes {
              postId: pageId
              date
              uri
              title
              content
          }
        }
      }
      `
      const data: any = await this.client.request(query)
      return data
    } catch (err) {
      console.error(`[graphql] search failed: ${err}`)
      throw err
    }
  }  

}

export default GraphqlService
