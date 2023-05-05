import serverlessExpress from 'aws-serverless-express'
import { Context } from 'aws-lambda'
import app from './app'
import { BuildService, OpensearchService } from './src/services'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      TARGET_ENV: string
      GSUITE_URL: string
    }
  }
}

const env = process.env.TARGET_ENV

const server = serverlessExpress.createServer(app)
export const handler = (event: any, context: Context) => {
  if (env === 'local') {
    if (event.headers) {
      const auth = event.headers.Authorization
      event.__auth = auth
      delete event.multiValueHeaders
      delete event.headers.Authorization
    }
  }

  const result = serverlessExpress.proxy(server, event, context)
  return result
}

export const build = async () => {

  const todaysDate = new Date()
  const currentYear = todaysDate.getFullYear()
  const startYear  = Number(process.env.BUILD_START_YEAR)

  const results = []
  const build = new BuildService()
  for(let y=startYear; y<=currentYear; y++){
    console.log(`Building ${y}`);
    const out = await build.year(String(y));
    results.push(out)
  }
  console.log(`Building Pages`);
  const out = await build.pages();
  results.push(out)

  return results
}

export const reset = async () => {
  const os = new OpensearchService()
  const out = await os.delete()
  return out.results.body
}

export const harvest = async () => {
  const build = new BuildService()
  const result = await build.harvest()
  return result
}

