import express from 'express';

import { MechalinkError } from 'errors/mechalink-error.ts';
import { updateUserLocation } from 'core/users.ts';
import { z } from 'zod';

const userLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const updateUserLocationController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.query;

    const { latitude, longitude } = userLocationSchema.parse(req.body);

    if (!String(userId)) {
      res.status(403).send('Role does not exist, enter client or mechanic');
      throw new MechalinkError('Role does not exist', 403);
    }

    if (userId) {
      const user = await updateUserLocation(Number(userId), {
        latitude,
        longitude,
      });

      return res.json(user);
    }
  } catch (error) {
    console.log(error);
  }
};
