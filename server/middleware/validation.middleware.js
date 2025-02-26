import { body, param, validationResult, query } from "express-validator";

export const validate = (validations) => {
  return async (req, res, next) => {
    // Run the validations
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    const extractedError = errors.array().map((err) => ({ 
      field: err.path,
      message: err.msg
    }));

    return res.status(400).json({ errors: extractedError });
  };
}

export const commonValidations = {
  pagination: [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a number"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be a number"),
  ],
  email: body("email").isEmail().normalizeEmail().withMessage("Email is invalid"),
  name: body("name").isString().withMessage("Name must be a string"),
}

export const validateSignUp = validate([
  commonValidations.email,
  commonValidations.name,
])