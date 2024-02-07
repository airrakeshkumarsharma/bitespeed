import { Joi } from "celebrate";

export const contactSchema = {
  create: {
    body: Joi.object().keys({
      email: Joi.string().email().trim().allow(null),
      phoneNumber: Joi.string().trim().allow(null)
    })
  }
};
