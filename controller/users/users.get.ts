import express from 'express';

import { UserRoles } from 'constants/constants.ts';
import { MechalinkError } from 'errors/mechalink-error.ts';
import { getUsersByRole } from 'core/users.ts';

export const getUsers = async (req: express.Request, res: express.Response) => {
  try {
    const { role } = req.query;

    if (
      !String(role).includes(UserRoles.client) &&
      !String(role)?.includes(UserRoles.mechanic)
    ) {
      res.status(403).send('Role does not exist, enter client or mechanic');
      throw new MechalinkError('Role does not exist', 403);
    }

    if (role) {
      const user = await getUsersByRole(role as keyof typeof UserRoles);

      return res.json(user);
    }
  } catch (error) {
    console.log(error);
  }
};
