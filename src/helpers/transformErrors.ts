import {ValidationError} from 'class-validator';
import {ValidationErrorField} from '../types/validation-error-field.type.js';

export function transformErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}
