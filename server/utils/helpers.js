const AppError = require("./appError");

function checkBody(fields) {
  return function (req, res, next) {
    const errors = fields
      .map((field) => {
        if (!req.body[field]) {
          return `Missing field ${field}`;
        }
      })
      .filter((el) => !!el);
    if (errors && errors.length > 0) {
      next(new AppError(errors[0], 400));
      return;
    } else {
      next();
    }
  };
}
function checkQuery(fields) {
  return function (req, res, next) {
    const errors = fields
      .map((field) => {
        if (!req.query[field]) {
          return `Missing field ${field}`;
        }
      })
      .filter((el) => !!el);
    if (errors && errors.length > 0) {
      next(new AppError(errors[0], 400));
      return;
    } else {
      next();
    }
  };
}
function checkParams(fields) {
  return function (req, res, next) {
    const errors = fields
      .map((field) => {
        if (!req.params[field]) {
          return `Missing field ${field}`;
        }
      })
      .filter((el) => !!el);
    if (errors && errors.length > 0) {
      next(new AppError(errors[0], 400));
      return;
    } else {
      next();
    }
  };
}

module.exports = { checkBody, checkQuery, checkParams };
