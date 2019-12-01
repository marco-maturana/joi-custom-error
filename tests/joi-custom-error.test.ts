import '../src/joi-custom-error'

import Joi from '@hapi/joi';
import {expect} from "chai";
import faker from 'faker';

describe('joi-custom-error customValidate', function() {
  it('returns values used for validation', function() {
    const schema = Joi.object({
      email: Joi.string().email().required().min(5),
      name: Joi.string().required().min(5),
    });

    const message = {email: faker.internet.email(), name: faker.name.findName()};

    const error = schema.customValidate(message);

    expect(error).to.have.property('values', message);
  });
})