const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};

const handleDuplicateFieldDB = (err) => {
  const value = err.cause.errmsg.match(/(["'])(.*?)\1/g);
  const message = `Duplicate field value: ${value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((er) => er.message);
  const message = `Invalid input data (${errors.join(`. `)})`;
  return new AppError(message, 400);
};

const handleJWTErrorDB = () =>
  new AppError(`There was a problem with the login token.`, 401);

const handleExpiredTokenErrorDB = () =>
  new AppError(`There your login token has expired, please login again.`, 401);

const sendDevError = (err, req, res) => {
  if (req.originalUrl.startsWith(`/api`)) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  return res
    .status(err.statusCode)
    .render(`error`, { title: `Error`, message: err.message });
};

const sendProdError = (err, req, res) => {
  if (req.originalUrl.startsWith(`/api`)) {
    if (err.isOperational) {
      return res
        .status(err.statusCode)
        .json({ status: err.status, message: err.message });
    }

    return res.status(500).json({ status: `error`, message: `SERVERERROR.` });
  }

  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .render(`error`, { title: `ERROR`, message: err.message });
  }
  return res.status(500).json({ status: `error`, message: `SERVERERROR.` });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || `error`;

  if (process.env.NODE_ENV === `development`) {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === `production`) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err, cause: err.cause, message: err.message };

    // eslint-disable-next-line no-unused-expressions
    if (error.cause?.name === `CastError`) error = handleCastErrorDB(error);
    if (error.cause?.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.errors?.passwordConfirm || error.errors?.email)
      error = handleValidationErrorDB(error);
    if (error.name === `JsonWebTokenError`) error = handleJWTErrorDB();
    if (error.name === `TokenExpiredError`) error = handleExpiredTokenErrorDB();

    sendProdError(error, req, res);
  }
};
