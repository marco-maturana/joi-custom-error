import Joi,{
  CustomValidationResult,
  ObjectSchema,
  SchemaMap,
  ValidationOptions,
} from '@hapi/joi';

declare module "@hapi/joi" {
  type CustomErrorsMessages<ValuesType> = {
    [Key in keyof ValuesType]: Array<string>
  }

  interface CustomValidationResult<ValuesType> {
    values: ValuesType;
    errors?: CustomErrorsMessages<ValuesType>;
  }

  interface ObjectSchema<TSchema = any> extends AnySchema{
    customValidate<ValuesType>(values: ValuesType, options?: ValidationOptions): CustomValidationResult<ValuesType>;
  }
}

type ObjectMethod = <TSchema>(schema?: SchemaMap<TSchema>) => ObjectSchema<TSchema>

const originalJoinObject = Joi.object;

Joi.object = function<TSchema = any>(schema?: SchemaMap<TSchema>): ObjectSchema<TSchema> {
  const objectWithBind: ObjectMethod = originalJoinObject.bind(this);
  const object = objectWithBind<TSchema>(schema);
  const originalValidate = object.validate;

  object.customValidate = function<ValuesType>(values: ValuesType, options?: ValidationOptions): CustomValidationResult<ValuesType> {
    const validateResult = originalValidate.apply(this, [values, {abortEarly: false, ...options}]);

    const customValidateResult: any = {values};

    if (validateResult.details) {
      const errors = validateResult.error.details.reduce((acc: any, detail: any) => {
        const keyErros = acc[detail.context.key] || [];

        keyErros.push(detail.message);

        return {
          ...acc,
          [detail.context.key]: keyErros
        }
      }, {});

      customValidateResult.errors = errors;
    }

    return customValidateResult;
  }

  return object;
}