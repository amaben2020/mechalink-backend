import { z, ZodError } from 'zod';
import { db } from '../../src/db.js';
import { usersTable } from '../../src/schema.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { MechalinkAlreadyExists } from '../../errors/index.js';
import { fromError } from 'zod-validation-error';
import firebaseAuthController from 'services/auth/firebase.js';

const signInSchema = z.object({
  password: z.string().min(4),
  email: z.string().email(),
});

export const signin = async (req, res) => {
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

    res.cookie('auth-cookie', (await userData.user.getIdTokenResult()).token, {
      maxAge: 900000,
      httpOnly: true,
    });
    res.json({ user: await userData.user });
  } catch (error) {
    const validationError = fromError(error);
    console.log(validationError);
    res.status(500).send(validationError.toString());
    console.log(error);
  }
};
