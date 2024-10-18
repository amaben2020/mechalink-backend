import { z, ZodError } from 'zod';
import { signinUser, signupUser } from '../../services/auth/index.js';
import { db } from '../../src/db.js';
import { usersTable } from '../../src/schema.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { MechalinkAlreadyExists } from '../../errors/index.js';
import { fromError } from 'zod-validation-error';

const signInSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(4),
  email: z.string().email(),
});

export const signin = async (req, res) => {
  try {
    const { email, password, username } = signInSchema.parse(req.body);

    const userHasRegistered = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .execute();

    if (userHasRegistered[0].email !== email) {
      res.status(403).send(`User with ${email} already exists`);
      throw new MechalinkAlreadyExists(`User with ${email} already exists`);
    }

    const userPassword = userHasRegistered[0].password;

    console.log(userPassword);

    const isUser = await bcrypt.compare(password, userPassword);

    console.log(isUser);

    // signupUser(username, password, email);
    signinUser(username, password, email);

    res.json({ user: email });
  } catch (error) {
    const validationError = fromError(error);
    console.log(validationError);
    res.status(500).send(validationError.toString());
  }
};
