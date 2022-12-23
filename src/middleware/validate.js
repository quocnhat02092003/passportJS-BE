const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export default validate;
