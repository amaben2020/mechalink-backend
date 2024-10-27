import { z } from 'zod';
import { db } from '../../src/db.js';
import { usersTable } from '../../src/schema.js';
import { eq } from 'drizzle-orm';
import { MechalinkAlreadyExists } from '../../errors/index.js';
import { fromError } from 'zod-validation-error';
import firebaseAuthController from 'services/auth/firebase.js';
import express from 'express';

const signInSchema = z.object({
  password: z.string().min(4),
  email: z.string().email(),
});

export const signin = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = signInSchema.parse(req.body);

    const userHasRegistered = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .execute();

    if (userHasRegistered[0].email !== email) {
      res.status(403).send(`User with ${email} already exists`);
      throw new MechalinkAlreadyExists(`User with ${email} already exists`);
    }

    const userData = await firebaseAuthController.login({ email, password });

    res.cookie(
      'auth-cookie',
      (await userData?.user.getIdTokenResult())?.token,
      {
        maxAge: 900000,
        httpOnly: true,
      }
    );

    if (userData?.user.uid) {
      res.status(200).json({ user: userData?.user });
    } else {
      res.status(401).json({ message: 'Email or password is wrong' });
    }
  } catch (error) {
    const validationError = fromError(error);

    res.status(500).send(validationError.toString());
  }
};
