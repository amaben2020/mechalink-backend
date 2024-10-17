import { z } from 'zod';
import { signupUser } from '../../services/auth/index.js';
import { db } from '../../src/db.js';
import pkg from 'http-errors';
import { usersTable } from '../../src/schema.js';

const signupSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(4),
  email: z.string().email(),
});

const { createHttpError } = pkg;

export const signup = async (req, res) => {
  try {
    const { email, password, username } = signupSchema.parse(req.body);
    console.log(username, password, email);
    // signupUser(username, password, email);
    const data = await db.select().from(usersTable);
    console.log(data);
    res.json({ db: data });
  } catch (error) {
    // throw createHttpError.BadRequest(
    //   'Please name should not be less than 2 characters or greater than 16 characters'
    // );
    console.log(error);
  }
};
