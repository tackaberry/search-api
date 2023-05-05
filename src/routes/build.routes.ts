import { Router, NextFunction } from 'express'
import { Request, Response } from 'express'

import { BuildService } from "../services"


const router = Router()

router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('[build controller] POST /')
    try {

      const build = new BuildService()
      const postType = req.body.post.post_type
      const postId = req.body.post.ID
      
      console.log(`[build controller] Building for ${postId} (${postType})`)

      const results = []
      if(postType==="post"){
        const result = await build.addPost(postId)
        results.push(result)
      }
      if(postType==="page"){
        const result = await build.addPage(postId)
        results.push(result)
      }

      res.json({ "results": "ok" })

    } catch (error) {
      next(error)
    }
  }
)

export default router
