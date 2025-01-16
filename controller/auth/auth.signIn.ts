import { z } from 'zod';
import { db } from '../../src/db.js';
import { usersTable } from '../../src/schema.ts';
import { eq } from 'drizzle-orm';
import { MechalinkAlreadyExists } from '../../errors/index.js';
import { fromError } from 'zod-validation-error';
import firebaseAuthController from 'services/auth/firebase.js';
import express, { NextFunction } from 'express';
import { MechalinkError } from 'errors/mechalink-error.ts';
import { tryCatchFn } from 'utils/tryCatch.ts';

const signInSchema = z.object({
  password: z.string().min(4),
  email: z.string().email(),
});

export const signin = tryCatchFn(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const { email, password } = signInSchema.parse(req.body);

    const [userHasRegistered = undefined] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .execute();

    if (userHasRegistered?.email !== email) {
      return next(
        new MechalinkAlreadyExists(`User with ${email} already exists`)
      );
    }

    const userData = await firebaseAuthController.login({ email, password });

    if (userData?.user.uid) {
      res.cookie(
        'auth-cookie',
        (await userData?.user.getIdTokenResult())?.token,
        {
          maxAge: 900000,
          httpOnly: true,
        }
      );

      res.status(200).json({
        user: userData?.user,
        role: userHasRegistered?.role,
        fullName:
          userHasRegistered?.firstName + ' ' + userHasRegistered?.lastName,
        phoneNumber: userHasRegistered?.phone,
        addressOne: userHasRegistered?.addressOne,
        addressTwo: userHasRegistered?.addressTwo,
        city: userHasRegistered?.city,
        state: userHasRegistered?.state,
        username: userHasRegistered?.username,
        zip: userHasRegistered?.zip,
        country: userHasRegistered?.country,
        email: userHasRegistered?.email,
        id: userHasRegistered?.id,
      });
      return; // Ensure no further execution
    } else {
      // At this point, a response is guaranteed to be sent
      const validationError = fromError({ message: 'something went wrong' });

      if (validationError) {
        return next(new MechalinkError(validationError.toString(), 500));
      }
    }
  }
);
