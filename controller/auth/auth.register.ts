import { z, ZodError } from 'zod';

import { db } from '../../src/db.js';
import { usersTable } from '../../src/schema.js';

import { eq } from 'drizzle-orm';
import { MechalinkAlreadyExists } from '../../errors/index.js';
import { fromError } from 'zod-validation-error';

import firebaseAuthController from 'services/auth/firebase.js';
import express from 'express';

const signupSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(4),
  email: z.string().email(),
  addressOne: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string(),
  lastLogin: z.string().optional(),
  addressTwo: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().max(6).optional(),
  country: z.string().max(2).optional(),
  role: z.enum(['admin', 'client', 'mechanic']),
});

export const signup = async (req: express.Request, res: express.Response) => {
  try {
    const {
      email,
      password,
      username,
      addressOne,
      firstName,
      lastName,
      lastLogin,
      city,
      country,
      addressTwo,
      zip,
      phone,
      role,
    } = signupSchema.parse(req.body);

    const userHasRegistered = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .execute();

    if (userHasRegistered.length > 0) {
      res.status(403).send(`User with ${email} already exists`);
      throw new MechalinkAlreadyExists(`User with ${email} already exists`);
    }

    const userData = await firebaseAuthController.register({ email, password });

    db.insert(usersTable)
      //@ts-ignore
      .values({
        email,
        username,
        firstName,
        addressOne,
        role,
        lastName,
        lastLogin,
        city,
        country,
        addressTwo,
        zip,
        phone,
        firebaseId: userData?.uid,
      })
      .returning();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    const validationError = fromError(error);
    console.log(error);
    res.status(500).send(validationError.toString());
  }
};
