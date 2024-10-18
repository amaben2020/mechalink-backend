import { z, ZodError } from 'zod';
import { signupUser } from '../../services/auth/index.js';
import { db } from '../../src/db.js';
import { usersTable } from '../../src/schema.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

const signupSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(4),
  email: z.string().email(),
  addressOne: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  lastLogin: z.string().optional(),
  addressOne: z.string().optional(),
  addressTwo: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().max(6).optional(),
  country: z.string().max(2).optional(),
  role: z.enum(['admin', 'client', 'mechanic']),
});

export const signup = async (req, res) => {
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

    // create several errors like TUPNotExistError
    if (userHasRegistered.length > 0) {
      res.status(401).send(`User with ${email} already exists`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    signupUser(username, password, email);

    const user = await db
      .insert(usersTable)
      .values({
        email,
        password: hashedPassword,
        firstName: username,
        addressOne: addressOne || '',
        role: role || '',
        firstName,
        lastName,
        lastLogin,
        city,
        country,
        addressTwo,
        zip,
        phone,
      })
      .returning();

    res.json({ user });
  } catch (error) {
    // Check if the error is a Zod validation error
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((issue) => {
        return `${issue.path[0]}: ${issue.message}`;
      });
      return res.status(400).json({ errors: errorMessages });
    }

    // Handle other errors
    console.error('Error during signup:', error);
    return res.status(500).send('Something went wrong. Please try again.');
  }
};
