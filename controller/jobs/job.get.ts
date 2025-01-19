import { fromError } from 'zod-validation-error';
import express from 'express';
import { getJob } from 'core/jobs.js';
import { z } from 'zod';

const jobIdSchema = z.string();

export const get = async (req: express.Request, res: express.Response) => {
  const jobId = jobIdSchema.parse(req.params.jobId);
  try {
    const job = await getJob(Number(jobId));

    if (job?.id) {
      res.status(200).json({ job });
    } else {
      res.status(404).json({ message: 'Job does not exist' });
    }
  } catch (error) {
    const validationError = fromError(error);
    res.status(500).send(validationError.toString());
  }
};
