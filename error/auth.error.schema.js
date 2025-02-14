const Joi = require("joi");
exports.authErrorSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(20)
    .regex(/[A-Z]/, "one uppercase letter")
    .regex(/[a-z]/, "one lowercase letter")
    .regex(/[0-9]/, "one number")
    .regex(/[@$!%*?&]/, "one special character")
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot exceed 20 characters",
      "string.pattern.name": "Password must contain at least {#name}",
    }),
});
