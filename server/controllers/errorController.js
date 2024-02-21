const globalErrorHandler = (err, req, res, next) => {
  console.log(err, "error");
  err.statusCode = err.statusCode || 400;
  err.status = !!err.status;

  res.status(err.statusCode).json({
    status: err.status,
    msg: err.msg || "Password must be at least 6 characters long",
    error: err,
    stack: err.stack,
  });
};

module.exports = globalErrorHandler;
