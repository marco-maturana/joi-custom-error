"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const originalJoinObject = joi_1.default.object;
joi_1.default.object = function (schema) {
    const objectWithBind = originalJoinObject.bind(this);
    const object = objectWithBind(schema);
    const originalValidate = object.validate;
    object.customValidate = function (values, options) {
        const validateResult = originalValidate.apply(this, [values, Object.assign({ abortEarly: false }, options)]);
        const customValidateResult = { values };
        if (validateResult.details) {
            const errors = validateResult.error.details.reduce((acc, detail) => {
                const keyErros = acc[detail.context.key] || [];
                keyErros.push(detail.message);
                return Object.assign(Object.assign({}, acc), { [detail.context.key]: keyErros });
            }, {});
            customValidateResult.errors = errors;
        }
        return customValidateResult;
    };
    return object;
};
