import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { UserRoles } from '../../constants/constants.ts';

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  role: varchar('user_role', {
    enum: Object.values(UserRoles) as [string, ...[string]],
    length: 256,
  }).default('mechanic'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  createdBy: text('created_by'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  updatedBy: text('updated_by'),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedBy: text('deleted_by'),
  firstName: text('first_name').unique(),
  lastName: text('last_name'),
  email: text('email').unique(),
  phone: text('phone').unique(),
  lastLogin: timestamp('last_login', { withTimezone: true }),
  password: text('password'),
  token: text('token').unique(),
  addressOne: text('address_one'),
  addressTwo: text('address_two'),
  city: text('city').default('Abuja'),
  state: text('state'),
  zip: text('zip'),
  country: text('country').default('NG'),
  firebaseId: text('fid').unique(),
  username: text('username').unique(),
});
