import { fromError } from 'zod-validation-error';
import express from 'express';
import { getJobs } from 'core/jobs.js';

export const getAll = async (_: express.Request, res: express.Response) => {
  try {
    const jobsData = await getJobs();

    res.status(201).json({ jobs: jobsData });
  } catch (error) {
    const validationError = fromError(error);
    res.status(500).send(validationError.toString());
  }
};
