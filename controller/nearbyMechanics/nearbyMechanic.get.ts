import { getNearbyMechanics } from 'core/nearbyMechanics.ts';
import express from 'express';

export const getNearbyMechanicsController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log('called');
    const radius = req.query.radius;
    const userId = req.query.userId;

    const nearbyMechs = await getNearbyMechanics(
      Number(radius),
      Number(userId)
    );

    console.log('nearbyMechs', nearbyMechs);

    return res.status(200).json({ nearbyMechs });
  } catch (error) {
    console.log(error);
  }
};
