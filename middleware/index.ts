import { firebaseAdmin } from 'config/firebase.js';
import { MechalinkError } from 'errors/mechalink-error.ts';
import express from 'express';

export const authenticatedRoute = (
  req: express.Request & { user: any },
  res: express.Response,
  next: express.NextFunction
) => {
  const idToken = req.headers.authorization?.split(' ')[1];
  if (!idToken) {
    throw new MechalinkError('Unauthenticated', 403);
  }
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
