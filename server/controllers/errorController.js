const globalErrorHandler = (err, req, res, next) => {
  console.log(err, "error");
  err.statusCode = err.statusCode || 400;
  err.status = !!err.status;

  res.status(err.statusCode).json({
    status: err.status,
    "Password Must be at Least 6 Characters Long",
    error: err,
    stack: err.stack,
  });
};

module.exports = globalErrorHandler;
