import { Response } from 'express';
import { MechalinkError } from 'errors/mechalink-error.ts';

/**
 * Sends a standardized success response.
 * @param res - Express Response object
 * @param data - The response payload
 * @param statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res: Response, data: any, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

/**
 * Sends a standardized error response using MechalinkError.
 * @param res - Express Response object
 * @param error - The MechalinkError instance or fallback error
 */
export const sendError = (res: Response, error: MechalinkError | Error) => {
  if (error instanceof MechalinkError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details, // Include additional details if provided
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
