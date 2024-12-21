import {Request, Response, NextFunction} from 'express';
import {inject, injectable} from 'inversify';
import {ExceptionFilter} from './exception-filter.interface.js';
import {Logger} from '../logger/logger.interface.js';
import {Component} from '../types/component.enum.js';
import {HttpError} from '../errors/http-error.js';
import {createErrorObject} from '../helpers/createErrorObject.js';
import {ServiceError} from '../types/service-error.enum.js';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`);

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ServiceError.CommonError, error.message));
  }
}
