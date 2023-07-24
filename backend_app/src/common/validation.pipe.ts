import { HttpStatus, ValidationError, ValidationPipe } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";

export const exceptionChildren = (errors: ValidationError[]) => {
  const result = {};
  errors.map(item => {
    if (item.constraints) {
      Object.entries(item.constraints).map(([_, message]) => {
        if (!result[item.property]) result[item.property] = message;
      });
    }
    if (item.children?.length) {
      result[item.property] = exceptionChildren(item.children);
    }
  });
  return result;
};

export const createValidationPipe = () => {
  return new ValidationPipe({
    enableDebugMessages: true,
    transform: true,
    disableErrorMessages: false,
    whitelist: true,
    exceptionFactory(errors: ValidationError[]) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Bad Request",
        errors: exceptionChildren(errors),
      });
    },
  });
};
