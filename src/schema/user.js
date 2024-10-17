import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'client', 'mechanic']);

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),

  // cos the mechanics are the least literate, they don't have to specify
  role: roleEnum().default('mechanic'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  createdBy: text('created_by'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  updatedBy: text('updated_by'),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedBy: text('deleted_by'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email').unique(),
  phone: text('phone').unique(),
  lastLogin: timestamp('last_login', { withTimezone: true }),
  password: text('password'),
  // token: text('token'),
  addressOne: text('address_one'),
  addressTwo: text('address_two'),
  city: text('city').default('Abuja'),
  state: text('state'),
  zip: text('zip'),
  country: text('country').default('NG'),
  cognitoSub: text('cognito_sub').unique(),
});
