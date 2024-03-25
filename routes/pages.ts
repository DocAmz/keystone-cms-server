import type { Request, Response } from 'express'
import type { Context } from '.keystone/types'

/*
  This example route handler gets all the tasks in the database and returns
  them as JSON data, emulating what you'd normally do in a REST API.

  More sophisticated API routes might accept query params to select fields,
  map more params to `where` arguments, add pagination support, etc.

  We're also demonstrating how you can query related data through the schema.
*/

export async function getPages (req: Request, res: Response, context: Context) {
  // Now we can use it to query the Keystone Schema
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
  // And return the result as JSON
  res.json(pages)
}