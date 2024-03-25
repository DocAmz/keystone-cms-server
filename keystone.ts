// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core';
import type { Request, Response } from 'express'
import cors from 'cors';

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema';
import { storageConfig } from './storage.config';
import { type TypeInfo, type Context } from '.keystone/types'
import { getPages } from './routes/pages';

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth';

function withContext<F extends (req: Request, res: Response, context: Context) => void>(
  commonContext: Context,
  f: F
) {
  return async (req: Request, res: Response) => {
    return f(req, res, await commonContext.withRequest(req, res))
  }
}

export default withAuth(
  config({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: 'sqlite',
      url: 'file:./keystone.db',
    },
    server: {
      extendExpressApp: (app, commonContext) => {
        app.use(cors({ origin: 'http://localhost:3001'}));
        app.get('/api/pages', withContext(commonContext, getPages))
        // app.put('/rest/tasks', withContext(commonContext, putTask));
      },
    },
    lists,
    session,
    storage: storageConfig,
  })
);
