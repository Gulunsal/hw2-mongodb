const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Bir şeyler yanlış gitti";

  res.status(statusCode).json({
    status: statusCode,
    message: message,
    data: err.data
  });
};

module.exports = errorHandler;
