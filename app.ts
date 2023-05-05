import express, { NextFunction } from 'express'
import awsMiddleware from 'aws-serverless-express/middleware'
import whitelist from './src/utilities/whitelist'
import { errorHandler } from './src/errors'
import { buildRouter, searchRouter } from './src/routes'
import { Request, Response } from 'express'

const env = process.env.TARGET_ENV

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(awsMiddleware.eventContext())

console.log(`ENVIRONMMENT : [${env}] `)

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.headers?.origin && whitelist.includes(req.headers.origin)) {
    res.append('Access-Control-Allow-Origin', req.headers.origin)
  }
  res.append('Access-Control-Allow-Credentials', 'true')
  res.append(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  next()
})

app.use('/search', searchRouter)
app.use('/build', buildRouter)


app.use(errorHandler)

export default app
