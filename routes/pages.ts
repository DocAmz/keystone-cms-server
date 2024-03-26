import type { Request, Response } from 'express'
import type { Context } from '.keystone/types'

export async function getPages (req: Request, res: Response, context: Context) {

  const pages = await context.query.Page.findMany({
    query: `
      title
      content {
        document
      }
      banner {
        url
      }
      isPublished
    `,
  })

  res.json(pages)
}