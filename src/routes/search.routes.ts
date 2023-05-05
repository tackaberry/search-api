import { Router, NextFunction } from 'express'
import { Request, Response } from 'express'

import { OpensearchService } from "../services"


const router = Router()

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('[search controller] GET /')
    try {

      const query: string = String(req.query.q);

      const os = new OpensearchService()
      const results = await os.search(query)

      console.log(`[search controller] user search: ${query} (${results.length} results)`)
      
      res.json({ "results": results })
    } catch (error) {
      next(error)
    }
  }
)

export default router
