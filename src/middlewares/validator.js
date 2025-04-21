const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path[0],
      }));
  
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    next();
};

module.exports = validateRequest;
  