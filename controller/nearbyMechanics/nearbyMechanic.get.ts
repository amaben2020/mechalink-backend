import { getNearbyMechanics } from 'core/nearbyMechanics.ts';
import express from 'express';

export const getNearbyMechanicsController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const radius = req.query.radius;

    const nearbyMechs = await getNearbyMechanics(Number(radius));

    console.log(nearbyMechs);

    return res.status(201).json({ nearbyMechs });
  } catch (error) {
    console.log(error);
  }
};
