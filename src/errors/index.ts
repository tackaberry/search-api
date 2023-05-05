import { Request, Response, NextFunction } from 'express'
import HttpException from './exception'

// eslint-disable no-unused-vars
export const errorHandler = (
  err: HttpException,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status) {
    res.status(err.status)
  } else {
    res.status(500).end()
  }
  return res.json({
    success: false,
    message: err.message || 'There was an error with the request',
  })
}
