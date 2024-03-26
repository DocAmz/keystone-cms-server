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
import { getPosts } from './routes/posts';
import { postContact } from './routes/contact';
import { ensureToken } from './access/access';

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth';
import bodyParser from 'body-parser';

function withContext<F extends (req: Request, res: Response, context: Context) => void>(
  commonContext: Context,
  f: F
) {
  return async (req: Request, res: Response) => {
    ensureToken(req, res, () => f(req, res, commonContext));
  }
}

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: 'file:./keystone.db',
    },
    server: {
      extendExpressApp: (app, commonContext) => {
        app.use(cors({ origin: 'http://localhost:3001'}));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.get("/api", withContext(commonContext, (req, res, context) => { res.render('index', { title: 'Express' })}))
        app.get('/api/pages', withContext(commonContext, getPages))
        app.get('/api/posts', withContext(commonContext, getPosts))
        app.post('/api/contact', withContext(commonContext, postContact))
      },
    },
    lists,
    session,
    storage: storageConfig,
  })
);
