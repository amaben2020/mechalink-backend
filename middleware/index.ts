import { firebaseAdmin } from 'config/firebase.js';
import express from 'express';

export const authenticatedRoute = (
  req: express.Request & { user: any },
  res: express.Response,
  next: express.NextFunction
) => {
  console.log('headers', req.headers);
  // check for bearer
  const idToken = req.headers.authorization?.split(' ')[1];

  // also check for user admin

  firebaseAdmin
    .auth()
    .verifyIdToken(idToken as string)
    .then((decodedToken) => {
      console.log(decodedToken);
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.log('Error verifying ID token:', error);
      res.status(401).json({ error: 'Invalid token' });
    });
};
