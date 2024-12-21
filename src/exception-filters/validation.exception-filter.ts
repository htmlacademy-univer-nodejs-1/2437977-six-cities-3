import {inject, injectable} from 'inversify';
import {StatusCodes} from 'http-status-codes';
import {NextFunction, Request, Response} from 'express';
import {ExceptionFilter} from './exception-filter.interface.js';
import {Component} from '../types/component.enum.js';
import {Logger} from '../logger/logger.interface.js';
import {createErrorObject} from '../helpers/createErrorObject.js';
import {ServiceError} from '../types/service-error.enum.js';
import {ValidationError} from '../errors/validation-error.js';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationException]: ${error.message}`);

    error.details.forEach(
      (errorField) => this.logger.error(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ServiceError.ValidationError, error.message, error.details));
  }
}
