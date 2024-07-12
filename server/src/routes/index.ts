import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';

import type { HttpError } from '../errors';
import { GenAIError } from '../errors';
import { GenAIModel } from '../genAIModel';

import { logger } from '../logger';

const router = express.Router();

const MAX_USER_INPUT_LENGTH = 300;

const allowedClientErrorCodes = [
  'INVALID_REQUEST_PARAMETER',
  'USER_INPUT_TOO_LONG',
];

interface GenAIParms {
  userInput: string;
}

const validateRequestParameters = (params: GenAIParms) => {
  if (!params.userInput || typeof params.userInput !== 'string') {
    throw new GenAIError(
      'Invalid user input in the request body.',
      'INVALID_REQUEST_PARAMETER',
      400,
    );
  }

  if (params.userInput.length > MAX_USER_INPUT_LENGTH) {
    throw new GenAIError(
      `The user input is too long. Expected "${MAX_USER_INPUT_LENGTH}", the actual length is "${params.userInput.length}". Try something with less characters.`,
      'USER_INPUT_TOO_LONG',
      413,
    );
  }
};

const getGenAIModel = (() => {
  let model: GenAIModel | null = null;
  return () => {
    if (!model) {
      model = new GenAIModel();
    }
    return model;
  };
})();

router.post(
  '/chat',
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info('User prompt received', { reqBody: req.body });
    validateRequestParameters(req.body);
    const aiResponse = await getGenAIModel().generate(req.body.userInput);
    res.json({ content: aiResponse });
  }),
);

router.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: HttpError, req: Request, res: Response, _next: NextFunction) => {
    logger.error(
      `An error occurred while requesting the '${req.route.path}' endpoint:`,
      err,
    );
    const status = (err.name === 'GenAIError' && err.status) || 500;
    return res
      .setHeader('Content-Type', 'application/json')
      .status(status)
      .send({
        error: status,
        errorCode:
          err.errorCode && allowedClientErrorCodes.includes(err.errorCode)
            ? err.errorCode
            : 'INTERNAL_SERVER_ERROR',
        detail: allowedClientErrorCodes.includes(err.errorCode)
          ? err.message
          : 'Internal Server Error',
      });
  },
);

export function setRoutes(app: express.Application) {
  app.use('/api', router);
}
