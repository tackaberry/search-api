# Website search

The website search stack is built in NodeJs on Serverless Framework.  The search index is AWS Opensearch.  The content is pulled from the (Wordpress) GraphQL API on a website.  There is a webhook that can be invoked on publish/update on wordpress that can trigger a content pull. 

## Architecture 

Serverless Framework runs on Cloudformation.  A Serverless deplloy command will publish the code but will also build all the appropriate infrastructure components.  The Serverless definition does not include CI/CD. 

## AWS Credentials

Set temporary AWS credentials to run locally.  Because this application signs calls to OpenSearch, you will need to ensure AWS credentials are in place. Credentials would also be needed to deploy.

## Get Started

1. Install pre-requisites

```bash
npm install -g serverless
```

2. Set Config file. Create an `.env.development` file that contains the following.  Exchange for the real search and graphql endpoints. 
```
ELASTICSEARCH_ENDPOINT: https://opensearch-domain.us-east-1.es.amazonaws.com/
GRAPHQL_ENDPOINT: http://website.local/graphql
BASE_URL: http://website.local
TARGET_ENV: dev
BUILD_START_YEAR: 2000
SITES: example.com, www.lipsum.com
```

3. Install dependencies

```bash
yarn
```

4. Start server
```bash
yarn start
```

5. Finally, Test with a simple call to `http://localhost:3001/search?q=postgres`.

## CLI Commands

- `yarn run deploy`: This will deploy the stack. 

- `yarn run invoke:build`: This will build the index for all posts and pages in the GraphQL api. 

- `yarn run invoke:reset`: This will delete the index. This is useful if you want to rebuild the field mapping. 

- `yarn run invoke:harvest`: This will scrape content from urls identified in `.env` and add it to the index as sites. 

## Webhook from Wordpress

`POST /build` is set up to receive json webhook from wordpress on creates and on updates for Pages and Posts.  This triggers the search to pull content from GraphQL and index it in the search engine. 

This requires https://wordpress.org/plugins/wp-webhooks/.


