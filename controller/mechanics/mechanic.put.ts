import { acceptTerms, getMechanicById } from 'core/mechanics.ts';
import express from 'express';

export const updateMechanicTermsAndConditions = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { mechanicId } = req.query;

    const mechanic = await getMechanicById(Number(mechanicId));

    // always do this in cuntroller
    if (!mechanic?.id) {
      res.status(404).json({
        message: 'Mechanic not found',
      });
    }

    const resp = await acceptTerms(Number(mechanicId));

    return res.json({ terms: resp });
  } catch (error) {
    console.log(error);
  }
};
