import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  Roarr as log,
} from 'roarr';

// Extend the Request interface to include the token property
declare global {
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

export function ensureToken(req: Request, res: Response, next: NextFunction): void {
  const bearerHeader = req.headers["authorization"] as string;

  if (typeof bearerHeader !== 'undefined') {
    try {

      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      const secretKey = process.env.JWT_SECRET_KEY;

      if (!secretKey) {
        console.error('JWT_SECRET_KEY is not set in the environment');
        res.sendStatus(500);
      } else {
        // Verify the token using the secret key
        const decodedToken = jwt.verify(bearerToken, secretKey);
        const frontAPIkey = process.env.FRONT_API_KEY;

        console.log(decodedToken);

        if (typeof decodedToken !== 'object') {
          console.error('Invalid token');
          res.statusMessage = 'Invalid token';
          res.sendStatus(403);
        }

        if(typeof decodedToken === 'object' && !decodedToken.hasOwnProperty('sub')) {
          console.error('Invalid token: sub missing');
          res.statusMessage = 'Invalid token: sub missing';
          res.sendStatus(403);
        }

        if(decodedToken.sub !== frontAPIkey) {
          console.error('Invalid token: API_KEY value');
          res.statusMessage = 'Invalid token: API_KEY value';
          res.sendStatus(403);
        }

        // If verification succeeds, set the token in the request object
        req.token = bearerToken;

        // Call the next middleware in the chain
        next();
      }

    } catch (err: any) {
      // If verification fails, log the error and send a 403 Forbidden response
      log.error(err);
      res.sendStatus(403);
    }
  } else {
    // If the Authorization header is not present, send a 403 Forbidden response
    res.sendStatus(403);
  }
}