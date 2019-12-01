/// <reference types="hapi__joi" />
declare module "@hapi/joi" {
    type CustomErrorsMessages<ValuesType> = {
        [Key in keyof ValuesType]: Array<string>;
    };
    interface CustomValidationResult<ValuesType> {
        values: ValuesType;
        errors?: CustomErrorsMessages<ValuesType>;
    }
    interface ObjectSchema<TSchema = any> extends AnySchema {
        customValidate<ValuesType>(values: ValuesType, options?: ValidationOptions): CustomValidationResult<ValuesType>;
    }
}
export {};
